import { Request, Response } from "express";
import { Document } from "mongoose";
import { Product } from "../models";

/**
 * @path /api/products/ : GET
 */
export const getProductsController = async (_req: Request, res: Response) => {
  try {
    const categories = await Product.find({state: true})
    .populate('user', 'name')
    .populate('category','name');

    return res.json({
      msg:'Get all products successfully',
      categories
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'Get all products failed',
      error,
    })
  }
}

/**
 * @path /api/products/:id : GET
 */
 export const getProductByIdController = async(_req: Request, res: Response) => {
  const product: Document = res.locals.product;

  //->Toca hacer dos awaits mientras que haciendo la busqueda en la db uno, no se sabe que es mas rapido
  await (await product.populate('user','name')).populate('category','name');

  return res.json({
    msg:'Get product by id successfully',
    product
  })
}

/**
 * @path /api/products/search?name=:name : GET
 */
 export const getProductsByNameController = async(req: Request, res: Response) => {
  const { name } = req.query as { name:string };

  const lower = name.toLowerCase();

  try {
    // const categories = await Product.find({lower:lower}); //--> Exact Match
    const products = await Product.find({lower: new RegExp('^' + lower)}) //--> Prefix Match (stars with)

    return res.json({
      msg:'Get products by name successfully',
      products
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'Get products by name failed',
      error,
    })
  }
}

/**
 * @path /api/products/ : POST
 */
 export const createProductController = async (req: Request, res: Response) => {
  //->Viene de la validacion del jwt
  const user = res.locals.authUser.id;

  //->Caso 1: Viene de la validacion del category validation (si se envia todo el objeto)
  // const category = res.locals.category.id;

  //->El state se extrae evitando manipulacion, el category viene en el body sobreescrito en el validate category
  //y el user se sobreescribe tambien para protegerlo de manipulacion
  const { state, ...rest } = req.body;

  //->Tambien se asegura que no se manipule el user
  rest.user = user;
  
  //->Con el caso 1: se sobreescribe la propiedad del body (un paso mas)
  // rest.category = category;

  try {
    const product  = new Product({...rest});

    await product.save();
    await product.populate('user', 'name');
    await product.populate('category', 'name');

    return res.status(500).json({
      msg: 'Product saved successfully',
      product,
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'Product saved failed',
      error,
    })
  }
}

/**
 * @path /api/products/:id : PUT
 */
 export const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const category = res.locals.category.id; //-> (solo si se envia el objeto y no el id)

  //->De los locals de la validacion del id del producto
  // const product: Document = res.locals.product;

  //->al igual que en el create en el body ya va el id del category sobreescrito por el validator, si no viene
  //-o no se actualiza vendra como undefinied o null y no se actualizara
  //extraemos el user y state para que nunca se actualice
  const { state, user, ...rest } = req.body;

  // rest.category = category //->Si enviaba el objeto y no el ir en los locals

  try {
    const product  = await Product.findByIdAndUpdate(id, rest, { new: true })
    .populate('user', 'name')
    .populate('category', 'name');

    //->Se ahorra una lectura a la db, es un poco mas rapido, no devuelve objeto actualizado
    // await product.updateOne(rest).populate('user','name').populate('category', 'name')

    return res.json({
      msg: 'Product updated successfully',
      product,
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'Product updated failed',
      error,
    })
  }
}

/**
 * @path /api/products/:id : DELETE
 */
 export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const product: Document = res.locals.product;

  try {
    //->Ya se verifico owner del producto y role
    const product  = await Product.findByIdAndUpdate(id, { state: false }, { new: true })
    .populate('user', 'name')
    .populate('category', 'name');

    //->Igual que en el update (no retorna actualizado)
    // await product.updateOne({state:false}).populate('user','name').populate('category','name');

    return res.json({
      msg: 'Product deleted successfully',
      product,
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'Product deleted failed',
      error,
    })
  }
}