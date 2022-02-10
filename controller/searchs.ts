import { Request, Response } from "express";
import { isValidObjectId, Document } from "mongoose";

import { catchError, errorTypes } from "../errors";
import { Category, Product, User } from "../models";


/**
 * @controller /api/search/:collection/:query : GET
 */
export const searchController = async (req: Request, res: Response) => {
  const { collection, query } = req.params;

  let searchObject = [{}]; //->objeto de busqueda
  
  let results : Document[] = []; //->para el tipado
  
  if(isValidObjectId(query)){
    searchObject = [{_id: query}]; //->Busqueda por id
  } else {
    const prefix = new RegExp(query.toLowerCase(), 'i'); //->Match en cualquier parte

    switch(collection.toLowerCase()) {
      case 'users':
        searchObject = [{name: prefix}, {email: prefix}];
        break;
      case 'categories':
        searchObject = [{name: prefix}];
        break;
      case 'products':
        searchObject = [{name: prefix}, {description: prefix}];
        break;
    }
  }

  try {
    switch(collection.toLowerCase()) {
      case 'users':
        results = await User.find({$or: [...searchObject], $and: [{state:true}]});
        break;
      case 'categories':
        results = await Category.find({$or: [...searchObject], $and: [{state:true}]});
        break;
      case 'products':
        results = await Product.find({$or: [...searchObject], $and: [{state:true}]});
        break;
    }

    return res.json({msg:'search successfully', results});
  } catch (error) {
    return catchError({error, type: errorTypes.search_documents, res});
  }
}