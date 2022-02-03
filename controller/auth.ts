import { Request, Response } from "express"
import { Document } from "mongoose";

import { generateJWT } from "../helpers";

/**
 * @path /auth/ : GET
 */
export const renewToken = async (req: Request, res: Response) => {
  const authUser : Document = res.locals.authUser;
  
  await authUser.populate('role', 'role')

  generateJWT(authUser.id).then((token) => {
    res.json({
      msg: 'Token renew',
      user: authUser,
      token
    })
  }).catch((error) => {
    console.log(error);
    return res.status(400).json(error)
  })
}

/**
 * @path /api/auth/login : POST
 */
export const login = async (req: Request, res: Response) => {
  const user : Document = res.locals.user

  await user.populate('role', 'role')
  
  generateJWT(user.id).then((token) => {
    res.json({
      msg: 'Login successfully',
      user,
      token
    })
  }).catch((error) => {
    console.log(error);
    return res.status(400).json(error)
  })
}
