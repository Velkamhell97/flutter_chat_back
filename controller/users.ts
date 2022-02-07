import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';

import { User } from '../models';
import { generateJWT } from "../helpers";
import { Document } from "mongoose";

/**
 * @path /api/users/ : GET
 */
export const getUsersController = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;

  const query = { state: true };

  try {
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).populate('role','role').skip(Number(from)).limit(Number(limit))
    ])
  
    res.json({
      msg: 'Users get successfully',
      total: total,
      users,
      count: users.length,
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User get failed',
      error,
    })
  }
}

/**
 * @path /api/users/:id : GET 
 */
 export const getUserByIdController = async (_req: Request, res: Response) => {
  //-> Se trae de la validacion del id (no hace de nuevo la consulta)
  const user : Document = res.locals.user;

  res.json({
    msg: 'Users by ID get successfully',
    user
  })
}

/**
 * @path /api/users/:id/categories : GET
 */
 export const getUserCategoriesController = async (_req: Request, res: Response) => {
  // const { id } = req.params;
  const user : Document = res.locals.user;

  try {
    //-> Se utiliza el populate virtual del userSchema para obtener sus categorias
    // const { categories } = await User.findById(req.params.id).populate('categories') as { categories: any };
    
    //-> Se trae de la validacion del id (no hace de nuevo la consulta)
    const { categories } = await user.populate('categories') as { categories: any };

    res.json({
      msg: 'User categories get successfully',
      //->No se puede hacer populate sobre un populate virtual, por lo que no se veran los detalles
      categories
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User categories failed',
      error,
    })
  }
}

/**
 * @path /api/users/ : POST
 */
export const createUserController = async (req: Request, res: Response) => {
  //->El password se modifica y el state no se debe modificar desde el front
  //->Aqui el rol que se recibe ya es el id porque se modifico el body en el role validator
  const { password, state, ...userData } = req.body;

  const salt = bcryptjs.genSaltSync();
  userData.password = bcryptjs.hashSync(password, salt);

  try {
    const user = new User(userData);

    await user.save();
    await user.populate('role', 'role')

    generateJWT(user.id).then((token) => {
      return res.json({
        msg: 'User saved successfully',
        user,
        token
      })
    }).catch((error) => {
      console.log(error);
      return res.status(400).json(error)
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User saved failed',
      error,
    })
  }
}

/**
 * @path /api/users/:id : PUT
 */
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const user : Document = res.locals.user;

  //->Igualmente en el rest ya esta el id del rol si se actualizo puesto por el role validation
  const { password, state, ...rest } = req.body;

  //-> Si se pasa el password se cambia caso contrario se omite en el update
  if(password){
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  
  try {
    //->Si se utiliza este metodo devuelve el documento actualizado
    const user = await User.findByIdAndUpdate(id, rest, { new: true }).populate('role', 'role');

    //-->Mas rapido pero no devuelve el documento actualizado sino el viejo
    // await user.updateOne(rest).populate('role','role'); 

    return res.json({
      msg: 'User update successfully',
      user
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User update failed',
      error
    })
  }
}

/**
 * @path /api/users/:id : DELETE
 */
export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const user : Document = res.locals.user;

  try {
    //->Solo desde aqui se puede modificar el state
    const user = await User.findByIdAndUpdate(id, { state: false }, { new: true }).populate('role', 'role');

    //->Al igual que el update este es rapido pero no devuelve el objeto actualizado, contrario al de arriba
    // user.updateOne({state: false})

    return res.json({
      msg: 'User delete successfully',
      user
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User delete failed',
      error
    })
  }
}

