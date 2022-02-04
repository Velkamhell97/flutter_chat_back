/*
  path: api/auth
*/
import { Router } from "express";

import {
  //-Body Validations
  loginValidations,
  googleValidations,
  
  //-Custom Middlewares
  validateBody,
  validateJWT,
  validateLogin
} from '../middlewares';

//-Routes Controllers
import { googleSignIn, login, renewToken } from "../controller/auth";

const router = Router();

router.get('/renew', validateJWT, renewToken);

router.post('/login', 
  loginValidations, 
  validateBody, 
  validateLogin,
  login
); 

router.post('/google', 
  googleValidations, 
  validateBody, 
  googleSignIn
); 

export default router;