import { Request, Response, NextFunction } from 'express';
import { Category, Product } from '../../models';

/**
 * @Middleware validate product id passed by params
 */
 export const validateProductID = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;

  const dbProduct = await Product.findById(id);

  if(!dbProduct || !dbProduct.state){
    return res.status(401).json({
      msg: `The product does not exist in the database`,
      error: 'Invalid prodcut ID',
    })
  } else {
    res.locals.product = dbProduct; //->envia el objeto por los locals
  }

  next();
}

/**
 * @Middleware validate product name (create and update is valid)
 */
 export const validateProductCategory = async (req : Request, res : Response, next: NextFunction) => {
  const { category } = req.body as { category: string };

  //->Como tambien se puede no actualizar la categoria se hace esta validacion, si no se envia llega null
  //-o undefined al controlelr por lo que no se actualiza
  if(!category){
    return next();
  }

  const trim = category.split(' ').filter(i => i).join(' ').toLowerCase();

  const dbCategory = await Category.findOne({lower: trim});

  if(!dbCategory){
    return res.status(401).json({
      msg: `The cateogry \'${category}\' does not exist in the database`,
      error: 'Unexisting category',
    })
  } else {
    //->Si se quiere enviar el objeto por los locals
    // res.locals.category = dbCategory
    //-> se reemplaza el body para que lleve de una vez el id (tambien se podria enviar el objeto)
    req.body.category = dbCategory.id; 
  }

  next();
}

/**
 * @Middleware validate product name (create and update is valid)
 */
 export const validateProduct = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body as { name: string };

  //->Cuando se crea y se actualiza se aplica la validacion, si no se actualiza se la salta
  if(!name){
    return next();
  }

  //->Formateamos para que haga match mas facil
  const trim = name.split(' ').filter(i => i).join(' ').toLowerCase();

  //->El product es case insensitve lo cual no dejara crear productos similares textualmente
  const dbProduct = await Product.findOne({lower: trim, _id: {$ne: id}});

  if(dbProduct){
    return res.status(401).json({
      msg: `The product with the name: \'${dbProduct.name}\' already exist`,
      error: 'Duplicate prodcut',
    })
  }

  next();
}

/**
 * @Middleware validate product name (create and update is valid)
 */
 export const validateProductAuthor = async (_req : Request, res : Response, next: NextFunction) => {
  const authUser = res.locals.authUser;
  const product = res.locals.product;

  console.log(authUser.id);

  if(product.user != authUser.id){
    return res.status(401).json({
      msg: `Only the author of this product can modify`,
      error: 'Unauthoraized',
    })
  }

  next();
}