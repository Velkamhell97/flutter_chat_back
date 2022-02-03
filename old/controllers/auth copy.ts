/*
  path: api/auth
  route: auth
*/
import { Request, Response } from "express"
import { Document } from "mongoose";

import { generateJWT } from "../../helpers";

/*
  path --> /api/auth : GET
*/
export const renewToken = async (req: Request, res: Response) => {
  // const authUser = req.authUser; //--> En el req (se necesita interfaz)
  // const authUser = req.body.authUser; //--> En el body
  const authUser : Document = res.locals.authUser; //--> En los locals
  
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

//-Se podrian crear interfaces en cada controlador para manejar tipadas las respuestas
/*
  path --> /api/auth/login : POST
*/
export const login = async (req: Request, res: Response) => {
  //-Se recibe de la validacion del input y password, asi no se hace otra operacion en la db
  // const user = req.user; //-->Forma 1 (interfaz)
  // const user = req.body.user; //--> Forma 2
  const user : Document = res.locals.user //--> Forma 3

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
