import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';

import { Role, User } from '../../models';
import { generateJWT } from "../../helpers";

//-Si se quiere almcenar los objetos en el req.var, no se sabe la diferencia con req.body.var
interface CustomRequest extends Request {
  roleID: string
}
 
/*
  path --> /api/users/ : GET
*/
export const getUsers = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;

  const query = { state: true };

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
}

/*
  path --> /api/users/ : POST
*/
export const createUser = async (req: Request, res: Response) => {
  const { password, role, ...data } = req.body;

  // const roleID = req.roleID; //--> Si se usa la interfaz (express validator - CustomRequest)
  // const roleID = req.body.roleID; //--> Si no se usa la interfaz (express validator)
  // const roleID = (await Role.findOne({role}))?.id //--> Si se evalua el rol aqui
  const roleID = res.locals.roleID; //--> Si se usa un custom middleware

  data.role = roleID;
  
  const salt = bcryptjs.genSaltSync();
  data.password = bcryptjs.hashSync(password, salt);

  const user  = new User(data);

  try {
    await user.save();

    await user.populate('role', 'role') //--> Solo para visualizar en la respuesta json el objeto rol bien

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
      error
    })
  }
}

/*
  path --> /api/users/ : PUT
*/
export const updateUser = async (req: Request, res: Response) => {
  const { _id, password, role, ...rest } = req.body;

  const { id } = req.params;

  if(password){
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  
  if(role){ 
    // const roleID = req.roleID; //--> Si se usa la interfaz (express validator)
    // const roleID = req.body.roleID; //--> Si no se usa la interfaz (express validator)
    // const roleID = (await Role.findOne({role}))?.id //--> Si se evalua el rol aqui
    const roleID = res.locals.roleID; //--> Si se usa un custom middleware
    rest.role = roleID;
  }

  try {
    //-Como en el middleware no se premitira un id de un registro eliminado (state en false) en este punto
    //-no abra problemas ya que todos los id estan activos
    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    await user!.populate('role', 'role');

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

/*
  path --> /api/users/ : DELETE
*/
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    //Borrar fisicamente
    // const user = await User.findByIdAndDelete(id);
 
    //Borrar logicamente
    const user = await User.findByIdAndUpdate(id, { state: false }, { new: true })

    await user!.populate('role', 'role')

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

