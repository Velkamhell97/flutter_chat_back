/**
 * @path /api/users
 */
import { Router } from "express";
import multer from 'multer';

//-Routes Middlewares
import { 
  createUserMiddlewares, 
  deleteUserMiddlewares, 
  getUserByIdMiddlewares, 
  getUserCategoriesMiddlewares, 
  updateUserMiddlewares 
} from "../middlewares";

//-Routes Controllers
import { 
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getUserCategoriesController,
  getUsersController,
} from "../controller/users";

const router = Router();

const upload = multer({dest: '/tmp/'})

router.get('/', getUsersController);

router.get('/:id',
  getUserByIdMiddlewares,
  getUserByIdController 
);

router.get('/:id/categories',
  getUserCategoriesMiddlewares,
  getUserCategoriesController
);

router.post('/', 
  upload.any(),
  createUserMiddlewares,
  createUserController,
);

router.put('/:id', 
  upload.any(),
  updateUserMiddlewares,
  updateUserController,
); 

router.delete('/:id', 
  deleteUserMiddlewares,
  deleteUserController
); 

export default router;