import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../../models';

/**
 * @Middleware validate login
 */
 export const validateLogin = async (req : Request, res : Response, next: NextFunction) => {
  const { email, password } = req.body
  
  const user = await User.findOne({email});

  if(!user || user.state == false){
    return res.status(401).json({
      msg: `The email or password is incorrect`,
      error: 'Login failed',
    })
  }

  const matchPassword = bcryptjs.compareSync(password, user.password)

  if(!matchPassword) {
    return res.status(401).json({
      msg: `The email or password is incorrect`,
      error: 'Login failed',
    })
  } else {
    res.locals.user = user;

    next()
  }
}