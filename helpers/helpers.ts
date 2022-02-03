import jwt from 'jsonwebtoken';

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