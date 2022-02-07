import { Router } from "express";
import { createProductController, deleteProductController, getProductByIdController, getProductsByNameController, getProductsController, updateProductController } from "../controller/products";
import { createProductMiddlewares, deleteProductMiddlewares, getProductyByIdMiddlewares, updateProductMiddlewares } from "../middlewares/products";

const router = Router();

router.get('/', getProductsController);

router.get('/search', getProductsByNameController);

router.get('/:id', 
  getProductyByIdMiddlewares,
  getProductByIdController
);

router.post('/',
  createProductMiddlewares,
  createProductController
)

router.put('/:id',
  updateProductMiddlewares,
  updateProductController
)

router.delete('/:id',
  deleteProductMiddlewares,
  deleteProductController
)

export default router;
