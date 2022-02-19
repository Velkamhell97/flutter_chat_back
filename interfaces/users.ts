import { Request } from 'express';
import { Document, Types } from 'mongoose';

import { User } from '../models/user';

export interface UsersRequest extends Request {
  body : UsersBody
}

interface UsersBody {
  name      : string,
  email     : string,
  password  : string,
  role      : string,
  avatar   ?: string
  // [rest: string] : string | boolean | undefined
}

export type UserDocument = Document<unknown, any, User> & User & { _id: Types.ObjectId };

