import { Request, Response, NextFunction } from 'express';
import { Category } from '../../models';

/**
 * @Middleware validate category id passed by params
 */
 export const validateCategoryID = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;

  const dbCategory = await Category.findById(id);

  if(!dbCategory || !dbCategory.state){
    return res.status(401).json({
      msg: `The category does not exist in the database`,
      error: 'Invalid category ID',
    })
  } else {
    //->Enviamos la categoria existente (de busqueda, de update o delete)
    res.locals.category = dbCategory;
  }

  next();
}

//-> en la validacion del id se busca por id, aqui por nombre, no se puede usar el res.locals.category
/**
 * @Middleware validate category name (create and update is valid)
 */
 export const validateCategory = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body as { name: string };

  //->Cuando se crea y actualiza cae en la validacion, cuando no se actualiza se la salta,
  if(!name){
    return next();
  }

  //->Quitamos el espaciado y dejamos solo uno (deberia ser trabajo del front enviarlo bien)
  const trim = name.split(' ').filter(i => i).join(' ').toLowerCase();

  //-Como el category tiene el schema sera case insensitive no tendra en cuenta mayusculas
  //-minusculas o acentos de esta manera no se crearan duplicados parecidos en algo minimo
  //-igual que en el user esto solo aplica si la categoria es diferente a la actual
  const dbCategory = await Category.findOne({lower: trim, _id: {$ne: id}});

  if(dbCategory){
    return res.status(401).json({
      msg: `The category with the name: \'${dbCategory.name}\' already exist`,
      error: 'Duplicate category',
    })
  }

  next();
}

/**
 * @Middleware validate the author of category
 */
 export const validateCategoryAuthor = async (_req : Request, res : Response, next: NextFunction) => {
  //->En este punto se tiene el id del auth user y la categoria con el validate category id, asi que
  //se compara que la categoria en cuestion tenga la misma id del usuario que quiera modificarla
  const category = res.locals.category;
  const authUser = res.locals.authUser;

  if(category.user != authUser.id){
    return res.status(401).json({
      msg: `Only the author of this category can modify`,
      error: 'Unauthoraized',
    })
  }

  next();
}