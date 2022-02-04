import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

export const generateJWT = (uid : string) => {
  return new Promise<string>((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY!, {
      expiresIn: '4h'
    }, (error, token) => {
      if(error){
        reject(error);
      } else {
        resolve(token!);
      }
    })
  })
}

export const verifyJWT = (token: string) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, process.env.SECRETORPRIVATEKEY!, {}, 
      (error, payload) => {
        if(error) {
          //-El error generado es muy largo, por eso se envia solo el mensaje
          reject(error.message);
        } else {
          resolve(payload as jwt.JwtPayload);
        }
    })
  })
}

export const googleVerify = async (token: string) : Promise<TokenPayload> => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, 
  });

  const payload = ticket.getPayload();

  return payload!;
}