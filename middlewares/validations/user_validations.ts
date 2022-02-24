import { Response, NextFunction } from 'express';

import { catchError, errorTypes } from '../../errors';
import { Role, User } from '../../models';
import { UsersRequest } from '../../interfaces/users';


/**
 * @middleware validate user id passed by params
 */
 export const validateUserID = async (req: UsersRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const dbUser = await User.findById(id);

  if(!dbUser || !dbUser.state){
    return catchError({type: errorTypes.user_not_found, res});
  } else {
    res.locals.user = dbUser;  //->util para los controllers que tengan el id en la ruta
  }

  next();
}


/**
 * @middleware validate user email (create and update valid)
 */
 export const validateEmail = async (req: UsersRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;

  if(!email){
    return next();
  }

  const dbUser = await User.findOne({email, _id: {$ne: id}});

  if(dbUser){
    return catchError({
      type: errorTypes.duplicate_email,
      extra: `The email ${email} is already in use`,
      res
    });
  }

  next();
}


/**
 * @middleware validate user role (create and update valid)
 */
export const validateRole = async (req: UsersRequest, res: Response, next: NextFunction) => {
  const { role } = req.body;

  if(!role) {
    return next();
  }

  const dbRole = await Role.findOne({name:role});

  if(!dbRole){
    return catchError({
      type: errorTypes.role_not_found,
      extra: `The role with the name \'${role}\' does not exist in the database`,
      res
    });
  } else {
    //->lo setea al body para ahorra una llamada al db, create y update
    req.body.role = dbRole.id;
  }

  next();
}