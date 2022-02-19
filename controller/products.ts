import { Response } from "express";

import { catchError, errorTypes } from "../errors";
import { Product } from "../models";
import { ProductDocument, ProductsRequest } from "../interfaces/products";
import { UserDocument } from "../interfaces/users";
import cloudinary from "../models/cloudinary";


/**
 * @controller /api/products/ : GET
 */
export const getProductsController = async (_req: ProductsRequest, res: Response) => {
  try {
    const products = await Product.find({state: true})
    .populate('user', 'name')
    .populate('category','name');

    return res.json({msg:'Get all products successfully', products});
  } catch (error) {
    return catchError({error, type: errorTypes.get_products, res});
  }
}


/**
 * @controller /api/products/search?name=:name : GET
 */
 export const getProductsByNameController = async(req: ProductsRequest, res: Response) => {
  const { name } = req.query;

  const lower = name?.toString().toLowerCase();

  try {
    const products = await Product.find({lower: new RegExp('^' + lower)}) //--> Prefix Match (stars with)

    return res.json({msg:'Get products by name successfully', products});
  } catch (error) {
    return catchError({error, type: errorTypes.get_products_by_name, res});
  }
}


/**
 * @controller /api/products/:id : GET
 */
 export const getProductByIdController = async(_req: ProductsRequest, res: Response) => {
  const product: ProductDocument = res.locals.product;
  await product.populate('user', 'name')
  await product.populate('category','name');

  return res.json({msg:'Get product by id successfully', product});
}


/**
 * @controller /api/products/ : POST
 */
 export const createProductController = async (req: ProductsRequest, res: Response) => {
  const productData = req.body;
  const authUser: UserDocument = res.locals.authUser;

  productData.user = authUser.id;
  const product  = new Product(productData);

  const img: Express.Multer.File | undefined = res.locals.file;
  
  if(img){
    try {
      const response = await cloudinary.uploadImage({path: img.path, filename: product.id, folder: 'products'});
      product.img = response.secure_url;
    } catch (error) { 
      return catchError({error, type: errorTypes.upload_cloudinary, res});
    }
  }

  try {
    //->el category ya estaba en el body por el middleware, tambien en el update
    await product.save();
    await product.populate('user', 'name');
    await product.populate('category', 'name');

    return res.json({msg: 'Product saved successfully', product});
  } catch (error) {
    return catchError({error, type: errorTypes.save_product, res});
  }
}


/**
 * @controller /api/products/:id : PUT
 */
 export const updateProductController = async (req: ProductsRequest, res: Response) => {
  const { id } = req.params;
  const { user, ...productData } = req.body;

  const img: Express.Multer.File | undefined = res.locals.file;

  if(img){
    try {
      const response = await cloudinary.uploadImage({path: img.path, filename: id, folder: 'products'});
      productData.img = response.secure_url;
    } catch (error) { 
      return catchError({error, type: errorTypes.upload_cloudinary, res});
    }
  }

  try {
    //->Se extrae lo que no se quiere dejar manipular en este caso el user
    const product  = await Product.findByIdAndUpdate(id, productData, {new: true})
    .populate('user', 'name')
    .populate('category', 'name');

    return res.json({msg: 'Product updated successfully', product});
  } catch (error) {
    return catchError({error, type: errorTypes.update_product, res});
  }
}


/**
 * @controller /api/products/:id : DELETE
 */
 export const deleteProductController = async (req: ProductsRequest, res: Response) => {
  const { id } = req.params;

  try {
    const product  = await Product.findByIdAndUpdate(id, { state: false }, { new: true })
    .populate('user', 'name')
    .populate('category', 'name');

    return res.json({msg: 'Product deleted successfully', product});
  } catch (error) {
    return catchError({error, type: errorTypes.delete_product, res});
  }
}