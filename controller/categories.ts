import { Response } from "express";

import { catchError, errorTypes } from "../errors";
import { CategoriesRequest, CategoryDocument } from "../interfaces/categories";
import { Category } from "../models";
import { UserDocument } from "../interfaces/users";


/**
 * @controller /api/categories/ : GET
 */
export const getCategoriesController = async(_req: CategoriesRequest, res: Response) => {
  try {
    const categories = await Category.find({state: true}).populate('user', 'name');

    return res.json({msg:'Get all categories successfully', categories});
  } catch (error) {
    return catchError({error, type: errorTypes.get_categories, res});
  }
}


/**
 * @controller /api/categories/search?name=:name : GET
 */
 export const getCategoriesByNameController = async(req: CategoriesRequest, res: Response) => {
  const { name } = req.query;

  const lower = name?.toString().toLowerCase();

  try {
    const categories = await Category.find({lower: new RegExp('^' + lower)}); //--> Prefix Match (starts with)

    return res.json({msg:'Get categories by name successfully', categories});
  } catch (error) {
    return catchError({error, type: errorTypes.get_categories_by_name, res});
  }
}


/**
 * @controller /api/categories/:id : GET
 */
 export const getCategoryByIdController = async(_req: CategoriesRequest, res: Response) => {
  const category: CategoryDocument = res.locals.category;
  await category.populate("user", "name")

  return res.json({msg:'Get category by id successfully', category});
}


/**
 * @controller /api/categories/:id/products : GET
 */
 export const getCategoriesProductsController = async(_req: CategoriesRequest, res: Response) => {
  const category: CategoryDocument = res.locals.category;

  try {
    const { products } = await category.populate({
      path: 'products',
      match: {state: true}, 
      populate: {path: 'user', select: 'name'}
    }) as any;
      
    return res.json({msg:'Get categories products successfully', products});
  } catch (error) {
    return catchError({error, type: errorTypes.get_category_products, res});
  }
}


/**
 * @controller /api/categories/ : POST
 */
export const createCategoryController = async(req: CategoriesRequest, res: Response) => {
  const categoryData = req.body;
  const authUser: UserDocument = res.locals.authUser;

  categoryData.user = authUser.id;
  const category = new Category(categoryData);

  try {
    await (await category.save()).populate('user', 'name');

    return res.json({msg: 'Category saved successfully', category});
  } catch (error) {
    return catchError({error, type: errorTypes.save_category, res});
  }
}


/**
 * @controller /api/categories/:id : PUT
 */
export const updateCategoryController = async(req: CategoriesRequest, res: Response) => {
  const { id } = req.params;
  const { user, ...categoryData } = req.body;

  // const category: CategoryDocument = res.locals.category;

  try {
    //->Mejor que con el updateOne y el save (con locals.category), solo se sube el name
    // category?.updateOne(categoryData, {new:true});
    const category = await Category.findByIdAndUpdate(id, categoryData, {new:true}).populate('user', 'name');

    return res.json({msg: 'Category updated successfully', category});
  } catch (error) {
    return catchError({error, type: errorTypes.update_category, res});
  }
}


/**
 * @controller /api/categories/:id : DELETE
 */
export const deleteCategoryController = async(req: CategoriesRequest, res: Response) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, {state: false}, {new: true}).populate('user', 'name');

    return res.json({msg: 'Category deleted successfully', category});
  } catch (error) {
    return catchError({error, type: errorTypes.delete_category, res});
  }
}