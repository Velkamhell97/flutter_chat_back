import { Request, Response } from "express"
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

import { AuthRequest } from "../interfaces/auth";
import { catchError, errorTypes } from "../errors";
import { generateJWT, generateResetToken, googleVerify, shuffle } from "../helpers";
import { Token, User } from "../models";
import { UserDocument } from "../interfaces/users";
import Mail from "nodemailer/lib/mailer";

/**
 * @controller /auth/renew : GET
 */
export const renewTokenController = async (_req: AuthRequest, res: Response) => {
  const user: UserDocument = res.locals.authUser;
  await user.populate('role', 'name');

  generateJWT(user.id).then((token) => {
    res.json({msg: 'Token renew', user, token});
  }).catch((error) => {
    return catchError({error, type: errorTypes.generate_jwt, res});
  })
}


/**
 * @controller /api/auth/login : POST
 */
export const loginController = async (_req: AuthRequest, res: Response) => {
  const user: UserDocument = res.locals.logedUser;
  await user.populate('role', 'name');

  generateJWT(user.id).then((token) => {
    res.json({msg: 'Login successfully', user, token});
  }).catch((error) => {
    return catchError({error, type: errorTypes.generate_jwt, res});
  })
}

/**
 * @controller /api/auth/send-reset-token : POST
 */
 export const sendResetTokenController = async (_req: AuthRequest, res: Response) => {
  const user: UserDocument = res.locals.resetUser;

  try {
    const token = new Token({token: generateResetToken(5), email: user.email});
    await token.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danielvalencia97@gmail.com',
        pass: 'bbhacvljzsmvqvwu'
      }
    })

    const mailOptions: Mail.Options = {
      from: 'danielvalencia97@gmail.com',
      to: user.email,
      subject: 'Flutter chat - reset password code',
      // text: '',
      html: `<p>Enter the code in the app to complete the password reset</p>
        <h2>${token.token}</h2>
      `
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return catchError({error, type: errorTypes.send_token_mail, res});
      } else {
        res.json({
          msg: 'Token send successfully', 
          // token
        });
      }
    })
  } catch (error) {
    return catchError({error, type: errorTypes.generate_reset_token, res});
  }
}

/**
 * @controller /api/auth/reset : POST
 */
 export const resetPasswordController = async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  const user: UserDocument = res.locals.resetUser;

  const salt = bcryptjs.genSaltSync();
  const hashPassword = bcryptjs.hashSync(password, salt);
  user.password = hashPassword;

  try {
    await user.save();
    res.json({msg: 'Password update successfully'});
  } catch (error) {
    return catchError({error, type: errorTypes.generate_reset_token, res});
  }
}


/**
 * @controller /api/auth/google : POST
 */
 export const googleSignInController = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try {
    const {name, email, picture} = await googleVerify(id_token);

    let user = await User.findOne({email});

    if(!user) {
      //->passwords menores a 6 letras no pasan el login normal solo valido por google
      user = new User({name, email, password:'less6', avatar: picture, google: true, role: "61fb0e905b08de3f3579fd0b"});
      await (await user.save()).populate('role', 'name');
    }

    if(!user.state) {
      //-Añadimos el email para el logout en el frontend
      return catchError({error: user, type:errorTypes.user_blocked, extra: email, res});
    }

    generateJWT(user.id).then((token) => {
      return res.json({msg: 'Google sign in successfully', user, token})
    }).catch((error) => {
      return catchError({error, type: errorTypes.generate_jwt, extra: email, res});
    })
  } catch (error) {
    return catchError({error, type: errorTypes.google_signin, res});
  }
}
