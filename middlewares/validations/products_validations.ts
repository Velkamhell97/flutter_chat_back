import { Response, NextFunction } from 'express';

import { catchError, errorTypes } from '../../errors';
import { Category, Product } from '../../models';
import { ProductDocument, ProductsRequest } from '../../interfaces/products';
import { UserDocument } from '../../interfaces/users';


/**
 * @middleware validate product id passed by params
 */
 export const validateProductID = async (req: ProductsRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const dbProduct = await Product.findById(id);

  if(!dbProduct || !dbProduct.state){
    return catchError({type: errorTypes.product_not_found, res});
  } else {
    res.locals.product = dbProduct;
  }

  next();
}


/**
 * @middleware validate product name (create and update is valid)
 */
 export const validateProductCategory = async (req: ProductsRequest, res: Response, next: NextFunction) => {
  const { category } = req.body;

  if(!category){
    return next();
  }

  const trim = category.toString().split(' ').filter(i => i).join(' ').toLowerCase();

  const dbCategory = await Category.findOne({lower: trim});

  if(!dbCategory){
    return catchError({
      type: errorTypes.category_not_found,
      extra: `The cateogry with the name \'${category}\' does not exist in the database`,
      res, 
    });
  } else {
    //->se precarga para no hacer otro llamado a la db util en el create y update
    req.body.category = dbCategory.id; 
  }

  next();
}


/**
 * @middleware validate product name (create and update is valid)
 */
 export const validateProduct = async (req: ProductsRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;

  if(!name){
    return next();
  }

  const trim = name.split(' ').filter(i => i).join(' ').toLowerCase();

  //-Se ahora la segunda comparacion, no se sabe que sea mas rapido
  // const dbProduct = await Product.findOne({lower: trim, _id: {$ne: id}});
  const dbProduct = await Product.findOne({lower: trim});

  if(dbProduct && dbProduct.id == id){
    return next();
  }

  if(dbProduct){
    return catchError({
      type: errorTypes.duplicate_product,
      extra: `The product with the name: \'${dbProduct.name}\' already exist`,
      res, 
    });
  }

  next();
}


/**
 * @middleware validate the author of product
 */
 export const validateProductAuthor = async (_req : ProductsRequest, res : Response, next: NextFunction) => {
  const authUser: UserDocument = res.locals.authUser;
  const product: ProductDocument = res.locals.product;

  if(product.user != authUser.id){
    return catchError({type: errorTypes.product_unauthorized, res});
  }

  next();
}

