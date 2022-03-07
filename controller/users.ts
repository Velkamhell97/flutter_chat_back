import { Response } from 'express';
import bcryptjs from 'bcryptjs';

import { catchError, errorTypes } from '../errors';
import { generateJWT } from "../helpers";
import { Message, User } from '../models';
import { UserDocument, UsersRequest } from "../interfaces/users";
import cloudinary from "../models/cloudinary";


/**
 * @controller /api/users/ : GET
 */
export const getUsersController = async (req: UsersRequest, res: Response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  try {
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      //-el populate por defecto trae el id, este se puede eliminar con la sintaxis -{field}
      User.find(query).populate('role', 'name -_id').skip(Number(from)).limit(Number(limit))
    ]);
  
    res.json({msg: 'Users get successfully', total, users, count: users.length});
  } catch (error) {
    return catchError({error, type: errorTypes.get_users, res});
  }
}


/**
 * @controller /api/users/connected : GET
 */
 export const getUsersConnectedController = async (req: UsersRequest, res: Response) => {
  const authUser: UserDocument = res.locals.authUser;

  try {
    const users = await User.find({_id: {$ne: authUser.id}}).sort('-online').populate('role', 'name');
    
    res.json({msg: 'Users get successfully', users});
  } catch (error) {
    return catchError({error, type: errorTypes.get_users, res});
  }
}

/**
 * @controller /api/users/:id : GET 
 */
 export const getUserByIdController = async (_req: UsersRequest, res: Response) => {
  const user: UserDocument = res.locals.user;
  await user.populate('role', 'name -_id')

  res.json({msg: 'Users by ID get successfully', user});
}


/**
 * @controller /api/users/:id/categories : GET
 */
 export const getUserCategoriesController = async (_req: UsersRequest, res: Response) => {
  const user: UserDocument = res.locals.user;

  try {
    //-Al parecer para eliminar solo el _id se debe agregar otra propiedad, es decir no debe quedar solo: select: '-__v -_id'
    //-y para eliminar el usuario, solo se puede si se especifican el resto de parametros excepto: select: 'name -user'
    const { categories } = await user.populate({path: 'categories',match: {state: true}}) as any;
    
    res.json({msg: 'User categories get successfully', categories});
  } catch (error) {
    return catchError({error, type: errorTypes.get_user_categories, res});
  }
}


/**
 * @controller /api/users/messages/:id : GET
 */
 export const getUserChatMessages = async (req: UsersRequest, res: Response) => {
  const from: UserDocument = res.locals.authUser;
  const to: UserDocument = res.locals.user;

  //-Se buscan los mensajes que yo le he enviado y los que el me ha enviado
  const lastMessages = await Message.find({
    $or: [{from: from.id, to: to.id}, {from: to.id, to: from.id}]
  }).sort({'createdAt' : 'desc'}).limit(30);

 try {
   res.json({msg: 'User messages get successfully', messages: lastMessages});
 } catch (error) {
   return catchError({error, type: errorTypes.get_user_chat_messages, res});
 }
}


/**
 * @controller /api/users/ : POST
 */
export const createUserController = async (req: UsersRequest, res: Response) => {
  const userData = req.body;
  
  const salt = bcryptjs.genSaltSync();
  const hashPassword = bcryptjs.hashSync(userData.password!, salt);
  userData.password = hashPassword;

  const user = new User(userData); 
  const avatar: Express.Multer.File | undefined = res.locals.file;

  if(avatar){
    try {
      const response = await cloudinary.uploadImage({path: avatar.path, filename: user.id, folder: 'users'});
      // deleteFilesLocal([avatar.path]) -> Borra archivos (no muy eficiente si estan en temp)
      user.avatar = response.secure_url;
    } catch (error) { 
      return catchError({error, type: errorTypes.upload_cloudinary, res});
    }
  }

  try {
    //->El role ya estaba cargado en el body por el middleware, tambien en el update
    await (await user.save()).populate('role', 'name');

    //Se podria hacer con await ya que el reject se toma como un throw, pero el error
    //no se podria diferenciar
    generateJWT(user.id).then((token) => {
      return res.json({msg: 'User saved successfully', user, token});
    }).catch((error) => {
      return catchError({error, type: errorTypes.generate_jwt, res});
    })
  } catch (error) {
    return catchError({error, type: errorTypes.save_user, res});
  }
}

/**
 * @controller /api/users/:id : PUT
 */
export const updateUserController = async (req: UsersRequest, res: Response) => {
  const { id } = req.params;
  const userData = req.body;

  if(userData.password){
    const salt = bcryptjs.genSaltSync();
    const hashPassword = bcryptjs.hashSync(userData.password, salt);
    userData.password = hashPassword;
  }

  const avatar: Express.Multer.File | undefined = res.locals.file; 

  if(avatar){
    try {
      const response = await cloudinary.uploadImage({path: avatar.path, filename: id, folder: 'users'});
      userData.avatar = response.secure_url;
    } catch (error) { 
      return catchError({error, type: errorTypes.upload_cloudinary, res});
    }
  }

  try {
    //->No necesaria transaccion ya que solo es una operacion a la db o se hace o falla (para create y update)
    const user = await User.findByIdAndUpdate(id, userData, {new: true}).populate('role', 'name');

    return res.json({msg: 'User update successfully', user});
  } catch (error) {
    return catchError({error, type: errorTypes.update_user, res});
  }
}


/**
 * @controller /api/users/unread/:from (to-id) : PUT
 */
 export const updateUnreadUserController = async (req: UsersRequest, res: Response) => {
  const user: UserDocument = res.locals.authUser;
  const { from } = req.params;

  const { reset = false } = req.body as any;

  try {
    if(reset){
      user.unread.set(from, 0);
    } else {
      const actual = user.unread.get(from) ?? 0;
      user.unread.set(from, actual + 1);
    } 
    
    await user.save();

    return res.json({msg: 'User unread update successfully', value: user.unread.get(from)});
  } catch (error) {
    return catchError({error, type: errorTypes.update_user, res});
  }
}

/**
 * @controller /api/users/:id : DELETE
 */
export const deleteUserController = async (req: UsersRequest, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, {state: false}, {new: true}).populate('role', 'name');

    return res.json({msg: 'User delete successfully', user});
  } catch (error) {
    return catchError({error, type: errorTypes.delete_user, res});
  }
}

