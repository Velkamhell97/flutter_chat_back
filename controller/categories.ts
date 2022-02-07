import { Request, Response } from "express";
import { Document } from "mongoose";
import { Category } from "../models";

/**
 * @path /api/categories/ : GET
 */
export const getCategoriesController = async(_req: Request, res: Response) => {
  try {
    const categories = await Category.find({state: true}).populate('user', 'name');

    return res.json({
      msg:'Get all categories successfully',
      categories
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Get all categories failed',
      error,
    })
  }
}

/**
 * @path /api/categories/search?name=:name : GET
 */
 export const getCategoriesByNameController = async(req: Request, res: Response) => {
  const { name } = req.query as { name:string };

  const lower = name.toLowerCase();

  try {
    // const categories = await Category.find({lower:lower}); //--> Exact Match

    //->Si se quiere que haga match en cualquier parte no solo el inicio quitar el ^
    const categories = await Category.find({lower: new RegExp('^' + lower)}) //--> Prefix Match (starts with)

    return res.json({
      msg:'Get categories by name successfully',
      categories
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Get categories by name failed',
      error,
    })
  }
}

/**
 * @path /api/categories/:id : GET
 */
 export const getCategoryByIdController = async(_req: Request, res: Response) => {
  const category: Document = res.locals.category;

  return res.json({
    msg:'Get category by id successfully',
    category
  })
}

/**
 * @path /api/categories/:id/products : GET
 */
 export const getCategoriesProductsController = async(_req: Request, res: Response) => {
  //  const { id } = req.params;
   const category = res.locals.category;

  try {
    //El select permite establecer que parametros devolver de la respuesta,
    // const { products } = await Category.findById(id).populate({path: 'products', select: 'name'}) as { products:any }
    
    //->Hace otro llamado a la db
    // const { products } = await Category.findById(id).populate('products') as { products:any }

    //->Igual que en user controller nos ahorramos una lectura a la db pero seguimos sin mostrar los detalles
    const { products } = await category.populate('products') as { products:any }

    return res.json({
      msg:'Get categories products successfully',
      //->se tendria que crear una propiedad en el producto para que almacene el nombre del usuario que lo creo
      products
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Get categories products failed',
      error,
    })
  }
}

/**
 * @path /api/categories/ : POST
 */
export const createCategoryController = async(req: Request, res: Response) => {
  //->Otra forma de proteger el state, en el user, se extraia, aqui se excluye
  const { name } = req.body

  //->Usuario autenticado pasado en el jwt validator, se hubiera podido pasar en el body para que se pasara
  //el body con el id del usuario directamente asi como la creacion del usuario con el role, pero
  //-como el jwt validator se comparte en tantas clases algunas no necesitan ese parametro en el body
  const user = res.locals.authUser.id;

  try {
    const category = new Category({name, user})

    await category.save();
    await category.populate('user', 'name')

    return res.json({
      msg: 'Category saved successfully',
      category,
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Category saved failed',
      error
    })
  }
}

/**
 * @path /api/categories/:id : PUT
 */
export const updateCategoryController = async(req: Request, res: Response) => {
  const { id } = req.params;
  // const category: Document = res.locals.category;

  //->Se excluye el state, tambien notar que el user nunca se actualiza, siempre se mantendra el mismo que lo creo
  const { name } = req.body;

  try {
    //->Forma 1, un poco mas lenta pero devuelve el documento actualizado
    const category = await Category.findByIdAndUpdate(id, {name}, { new: true }).populate('user','name');

    //->Forma 2, un poco mas rapido pero no devuelve el documento actualizado
    // await category.updateOne({name}).populate('user','name');

    return res.json({
      msg: 'Category updated successfully',
      category,
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Category update failed',
      error
    })
  }
}

/**
 * @path /api/categories/:id : DELETE
 */
export const deleteCategoryController = async(req: Request, res: Response) => {
  const { id } = req.params;
  // const category: Document = res.locals.category;

  try {
    //->En este punto ya se verifico que el creador de esta categoria es el que la intenta borrar
    const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true }).populate('user', 'name');

    //-> Igual que en el update
    // await category.updateOne({state:false}).populate('user','name');

    return res.json({
      msg: 'Category deleted successfully',
      category,
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Category deleted failed',
      error
    })
  }
}