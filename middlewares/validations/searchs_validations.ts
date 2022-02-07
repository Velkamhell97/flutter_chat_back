import { NextFunction, Request, Response } from "express";

export const validateCollection = async (req: Request, res: Response, next: NextFunction) => {
  const { collection } = req.params;

  const collections = ['users', 'categories', 'products'];

  //->No necesitamos enviar ningun id o objeto porque no hacemos ninguna peticion a la db
  if(!collections.includes(collection.toLowerCase())) {
    return res.status(401).json({
      msg: `No one collection match with \'${collection}\' `,
      error: 'Collection not found',
    })
  }

  next();
}