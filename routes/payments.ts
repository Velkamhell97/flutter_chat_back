import { Router, raw, json } from "express";

import { 
  stripeChargeCardOffSessionController, 
  stripeChargeController, 
  stripeGetPaymentMethodsController, 
  stripeManualIntentController, 
  stripePaymentIntentController, 
  stripeSetupIntentController, 
  stripeWebhookController
} from "../controller/payments";

import { 
  stripeChargeCardOffSessionMiddlewares, 
  stripeChargeMiddlewares, 
  stripeGetPaymentMethodsMiddlewares, 
  stripeManualIntentMiddlewares, 
  stripePaymentIntentMiddlewares, 
  stripeSetupIntentMiddlewares
} from "../middlewares";

const router = Router();

router.post('/stripe/payment-methods',
  json(),
  stripeGetPaymentMethodsMiddlewares,
  stripeGetPaymentMethodsController
)

router.post('/stripe/payment-intent',
  json(),
  stripePaymentIntentMiddlewares,
  stripePaymentIntentController
)

router.post('/stripe/manual-intent',
  json(),
  stripeManualIntentMiddlewares,
  stripeManualIntentController
)

router.post('/stripe/apply-charge',
  json(),
  stripeChargeMiddlewares,
  stripeChargeController
)

router.post('/stripe/setup-intent',
  json(),
  stripeSetupIntentMiddlewares,
  stripeSetupIntentController
)

router.post('/stripe/webhook', 
  raw({type: "application/json"}),
  stripeWebhookController
)

router.post('/stripe/charge-card-off-session',
  json(),
  stripeChargeCardOffSessionMiddlewares,
  stripeChargeCardOffSessionController
)

export default router;