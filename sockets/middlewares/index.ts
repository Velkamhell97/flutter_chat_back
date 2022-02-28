import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { generateJWT, verifyJWTUser } from '../../helpers';

type SocketNext = (err?: ExtendedError | undefined) => void;

class CustomError extends Error {
  details:any;

  constructor(message: string, details:any) {
    super(message);
    this.details = details;
  }
}

export const isAuth = async (socket:Socket, next:SocketNext) => {
  const token = socket.handshake.auth.token;
  
  try {
    const authUser = await verifyJWTUser(token);
    const newToken = await generateJWT(authUser.id);
    
    socket.data = {authUser, newToken};
    next();
  } catch (error) {
    console.log('error: ', error);
    next(new CustomError('Unauthoraized', error));
  }
}