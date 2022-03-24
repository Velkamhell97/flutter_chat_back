import { Router } from "express";

import { stripeIntentController } from "../controller/payments";
import { stripeIntentMiddlewares } from "../middlewares";

const router = Router();

router.post('/stripe-intent', 
  stripeIntentMiddlewares,
  stripeIntentController
)

export default router;