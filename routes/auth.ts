/*
  path: api/auth
*/
import { Router } from "express";

import {
  //-Body Validations
  loginValidations,
  
  //-Custom Middlewares
  validateBody,
  validateJWT,
  validateLogin
} from '../middlewares';

//-Routes Controllers
import { login, renewToken } from "../controller/auth";

const router = Router();

router.get('/renew', validateJWT, renewToken);

router.post('/login', 
  loginValidations, 
  validateBody, 
  validateLogin,
  login
); 

export default router;