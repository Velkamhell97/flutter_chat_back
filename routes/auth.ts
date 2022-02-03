/*
  path: api/auth
*/
import { Router } from "express";

import { validateBody, validateJWT, validateLoginEmail, validateLoginPassword } from "../middlewares/validations";

import { loginValidations } from "../middlewares/auth";

import { login, renewToken } from "../controller/auth";

const router = Router();

//-Al parecer se utiliza para renovar el jwt
router.get('/', validateJWT, renewToken);

// router.post('/login', loginValidations, validateBody, login); //-->Forma 1
router.post('/login', loginValidations, validateBody, validateLoginEmail, validateLoginPassword, login); //-->Forma 2

export default router;