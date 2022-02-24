/**
 * @path /api/auth
 */
import { Router } from "express";

//-Routes Middlewares
import {
  renewTokenMiddlewares,
  loginMiddlewares,
  googleSignInMiddlewares,
  sendResetTokenMiddlewares,
  resetPasswordMiddlewares,
} from '../middlewares';

//-Routes Controllers
import { 
  googleSignInController,
  loginController, 
  renewTokenController, 
  resetPasswordController,
  sendResetTokenController,
} from "../controller/auth";

const router = Router();

router.get('/renew', 
  renewTokenMiddlewares,
  renewTokenController
);

router.post('/login', 
  loginMiddlewares,
  loginController
); 

router.post('/send-reset-token', 
  sendResetTokenMiddlewares,
  sendResetTokenController
); 

router.post('/reset-password', 
  resetPasswordMiddlewares,
  resetPasswordController
); 

router.post('/google', 
  googleSignInMiddlewares,
  googleSignInController
); 

export default router;