/*
  path: /api/users
*/
import { Router } from "express";

import {
  //-Body Validations
  createUserValidations,
  updateUserValidations,
  deleteUserValidations,
  
  //-Custom Middlewares
  validateBody,
  validateEmail,
  validateJWT,
  validateMongoID,
  validatePermissions,
  validateRole,
} from '../middlewares';

//-Routes Controllers
import { getUsers, createUser, updateUser, deleteUser } from "../controller/users";

const router = Router();

router.get('/', getUsers);

router.post('/', 
  createUserValidations, 
  validateBody, 
  validateEmail,  
  validateRole, 
  createUser
);

router.put('/:id', 
  updateUserValidations, 
  validateBody, 
  validateMongoID, 
  validateEmail,  
  validateRole,
  updateUser
); 

router.delete('/:id', 
  validateJWT, 
  deleteUserValidations, 
  validateBody, 
  validateMongoID, 
  validatePermissions, 
  deleteUser
); 

export default router;