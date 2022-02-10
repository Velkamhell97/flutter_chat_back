import { Request } from 'express';
import { Document, Types } from 'mongoose';

import { User } from '../models/user';

export interface UsersRequest extends Request {
  body : UsersBody
}

interface UsersBody {
  email ?: string,
  password ?: string,
  role ?: string,
  state ?: boolean,
  avatar ?: string
  // [rest: string] : string | boolean | undefined
}

export type UserDocument = Document<unknown, any, User> & User & { _id: Types.ObjectId };

