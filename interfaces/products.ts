import { Request,} from 'express';
import { Document, Types } from 'mongoose';

import { Product } from '../models/product';

export interface ProductsRequest extends Request {
  body : ProductsBody
}

interface ProductsBody {
  name         : string,
  user         : Types.ObjectId | string,
  price       ?: number,
  img         ?: string,
  category     : Types.ObjectId | string,
  description ?: string,
  available   ?: boolean,
  // [rest: string] : string | boolean | undefined
}

export type ProductDocument = Document<unknown, any, Product> & Product & { _id: Types.ObjectId };


