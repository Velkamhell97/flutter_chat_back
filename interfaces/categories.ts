import { Request } from 'express';
import { Document, Types } from 'mongoose';

import { Category } from '../models/category';

export interface CategoriesRequest extends Request {
  body : CategoriesBody,
}

interface CategoriesBody {
  name ?: string,
  state ?: boolean,
  user ?: Types.ObjectId | string
  // [rest: string] : string | boolean | undefined
}

export type CategoryDocument =  Document<unknown, any, Category> & Category & { _id: Types.ObjectId };