import { Response, NextFunction } from 'express';

import { catchError, errorTypes } from '../../errors';
import { CategoriesRequest, CategoryDocument } from '../../interfaces/categories';
import { Category } from '../../models';
import { UserDocument } from '../../interfaces/users';

/**
 * @middleware validate category id passed by params
 */
 export const validateCategoryID = async (req : CategoriesRequest, res : Response, next: NextFunction) => {
  const { id } = req.params;

  const dbCategory = await Category.findById(id);

  if(!dbCategory || !dbCategory.state){
    return catchError({type: errorTypes.category_not_found, res});
  } else {
    res.locals.category = dbCategory; //->para controllers que tengan en la ruta el id
  }

  next();
}

/**
 * @middleware validate category name (create and update is valid)
 */
export const validateCategory = async (req : CategoriesRequest, res : Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;

  if(!name){
    return next();
  }

  //->Se formatea la informacion, para que haga match con el collate, deberia ser trabajo del front
  const trim = name.split(' ').filter(i => i).join(' ').toLowerCase();

  const dbCategory = await Category.findOne({lower: trim, _id: {$ne: id}});

  if(dbCategory){
    return catchError({
      type: errorTypes.duplicate_category,
      extra: `The category with the name: \'${dbCategory.name}\' already exist`,
      res, 
    });
  }

  next();
}


/**
 * @middleware validate the author of category
 */
 export const validateCategoryAuthor = async (_req : CategoriesRequest, res : Response, next: NextFunction) => {
  const category: CategoryDocument  = res.locals.category;
  const authUser: UserDocument = res.locals.authUser;

  if(category.user != authUser.id){
    return catchError({type: errorTypes.category_unauthorized, res});
  }

  next();
}