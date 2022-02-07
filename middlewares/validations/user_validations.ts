import { Request, Response, NextFunction } from 'express';
import { Role, User } from '../../models';

/**
 * @Middleware validate user id passed by params
 */
 export const validateUserID = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;

  const dbUser = await User.findById(id);

  if(!dbUser || !dbUser.state){
    return res.status(401).json({
      msg: `The user does not exist in the database`,
      error: 'Invalid user ID',
    })
  } else {
    //->Se devuelve directamente al controlador (no vuelve a hacer la consulta del id)
    res.locals.user = dbUser; 
  }

  next();
}

/**
 * @Middleware validate user email (create and update valid)
 */
 export const validateEmail = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;

  //->Si se crea o se actualiza se verifica que este disponible, si no se actualiza salta la validacion
  if(!email){
    return next();
  }

  //->Que haya un email igual en la db y que su id sea diferente al que se actualiza
  const dbUser = await User.findOne({email, _id: {$ne: id}})

  if(dbUser){
    return res.status(401).json({
      msg: `The email ${email} is already in use`,
      error: 'Duplicate email',
    })
  }

  next();
}

/**
 * @Middleware validate user role (create and update valid)
 */
export const validateRole = async (req : Request, res : Response, next: NextFunction) => {
  const { role } = req.body;

  //->Si se crea o actualiza el role se activa la validacion, si no se actualiza se salta la validacion
  if(!role) {
    return next();
  }
  
  const dbRole = await Role.findOne({role});

  if(!dbRole){
    return res.status(401).json({
      msg: `The role ${role} does not exist`,
      error: 'Invalid role',
    })
  } else {
    //->Como se guarda el id del role, reemplaza el texto por el id directamente y no se desestructura en el controller
    req.body.role = dbRole.id;

    next();
  }
}