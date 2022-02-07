import { Request, Response } from "express";
import { isValidObjectId, Document, FilterQuery } from "mongoose";
import { Category, Product, User } from "../models";

export const searchController = async (req: Request, res: Response) => {
  //-Aqui ya aseguramos que la colleccion es valida, el query como puede ser un id o una descripcion o un numero
  //-no se hace la validacion si no encuentra nada solo devolvera vacio
  const { collection, query } = req.params;

  let searchObject = [{}];

  let results: Document[] = [];

  if(isValidObjectId(query)){
    //-Si es un id se busca por id
    searchObject = [{_id: query}];
  } else {
    // const prefix = new RegExp('^' + query.toLowerCase(), 'i');
    const prefix = new RegExp(query.toLowerCase(), 'i');

    //-Se cambian los criterios de busqueda segun la categoria, todos con expresiones regulares
    switch(collection.toLowerCase()) {
      case 'users':
        searchObject = [{name: prefix}, {email: prefix}];
        break
      case 'categories':
        searchObject = [{name: prefix}];
        break;
      case 'products':
        searchObject = [{name: prefix}, {description: prefix}];
        break;
    }
  }

  //-Dependiendo de la categoria se hace la peticion al modelo correspondiente, todas deben tenre el state en true
  try {
    switch(collection.toLowerCase()) {
      case 'users':
        results = await User.find({$or: [...searchObject], $and: [{state:true}]});
        break
      case 'categories':
        results = await Category.find({$or: [...searchObject], $and: [{state:true}]});
        break;
      case 'products':
        results = await Product.find({$or: [...searchObject], $and: [{state:true}]});
        break;
    }

    return res.json({
      msg:'search successfully',
      results
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'search failed',
      error,
    })
  }
}