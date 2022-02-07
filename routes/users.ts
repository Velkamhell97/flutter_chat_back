/**
 * @path /api/users
 */
import { Router } from "express";

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
  getUsersController
} from "../controller/users";

const router = Router();

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
  createUserMiddlewares,
  createUserController,
);

router.put('/:id', 
  updateUserMiddlewares,
  updateUserController,
); 

router.delete('/:id', 
  deleteUserMiddlewares,
  deleteUserController
); 

export default router;