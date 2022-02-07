import { Router } from "express";
import { searchController } from "../controller/searchs";
import { searchMiddlewares } from "../middlewares/searchs";

const router = Router();

router.get('/:collection/:query', 
  searchMiddlewares,
  searchController
)

export default router;