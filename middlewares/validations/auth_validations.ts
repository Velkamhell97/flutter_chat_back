import { Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';

import { AuthRequest } from '../../interfaces/auth';
import { catchError, errorTypes } from '../../errors';
import { Token, User } from '../../models';


/**
 * @middleware validate login
 */
 export const validateLogin = async (req : AuthRequest, res : Response, next: NextFunction) => {
  const { email, password } = req.body;
    
  const user = await User.findOne({email});

  if(!user || user.state == false){
    return catchError({type: errorTypes.login, res});
  }

  const matchPassword = bcryptjs.compareSync(password, user.password)

  if(!matchPassword) {
    return catchError({type: errorTypes.login, res})
  } else {
    res.locals.logedUser = user;
  }

  next()
}

/**
 * @middleware validate reset password
 */
 export const validateResetEmail = async (req : AuthRequest, res : Response, next: NextFunction) => {
  const { email } = req.body;
  
  const user = await User.findOne({email});

  if(!user || user.state == false){
    return catchError({type: errorTypes.email_not_found, res});
  } else {
    res.locals.resetUser = user;
  }

  next()
}

/**
 * @middleware validate reset token
 */
 export const validateResetToken = async (req : AuthRequest, res : Response, next: NextFunction) => {
  const { resetToken } = req.body;
  
  const token = await Token.findOne({token: resetToken});

  if(!token){
    return catchError({type: errorTypes.invalid_reset_token, res});
  }

  
  const user = await User.findOne({email: token.email});
  await token.delete(); //-Borramos el token

  if(!user || !user.state){
    return catchError({type: errorTypes.user_not_found, res});
  } else {
    res.locals.resetUser = user;
  }


  next()
}