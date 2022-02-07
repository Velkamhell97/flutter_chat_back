import { Request, Response } from "express"
import { Document } from "mongoose";

import { generateJWT, googleVerify } from "../helpers";
import { User } from "../models";

/**
 * @path /auth/renew : GET
 */
export const renewTokenController = async (req: Request, res: Response) => {
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
    return res.status(500).json({
      msg: 'Error when renwe token',
      error
    })
  })
}

/**
 * @path /api/auth/login : POST
 */
export const loginController = async (req: Request, res: Response) => {
  const user : Document = res.locals.user
  
  await user.populate('role', 'role')
  
  generateJWT(user.id).then((token) => {
    res.json({
      msg: 'Login successfully',
      user,
      token
    })
  }).catch((error) => {
    return res.status(500).json({
      msg: 'Error when generate token',
      error
    })
  })
}

/**
 * @path /api/auth/google : POST
 */
 export const googleSignInController = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try {
    const {name, email, picture} = await googleVerify(id_token);

    let user = await User.findOne({email});

    if(!user) {
      console.log('no existe');
      //-Si crea la cuenta en google, no podra registrarse normalmente ya que en la validacion del login
      //-no se permiten contraseñas tan cortas
      user = new User({name, email, password:'any', avatar: picture, google: true, role: "61fb0e905b08de3f3579fd0b"})

      await user.save();
    }

    if(!user.state) {
      return res.status(401).json({
        error: 'User block',
        msg: 'This user was blocked from the database',
        email: user.email
      })
    }

    await user.populate('role', 'role');

    generateJWT(user.id).then((token) => {
      return res.json({
        msg: 'Google sign in successfully',
        user,
        token
      })
    }).catch((error) => {
      return res.status(500).json({
        msg: 'Error when generate token',
        error
      })
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Google sign in error',
      error
    })
  }
}
