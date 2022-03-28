import { 
  stripeChargeBody, 
  stripeChargeCardOffSessionBody, 
  stripeGetPaymentMethodsBody, 
  stripeManualIntentBody, 
  stripePaymentIntentBody, 
  stripeSetupIntentBody 
} from "./body/payments_schema";

import { validateBody } from "./validations/shared_validations";


export const stripeGetPaymentMethodsMiddlewares = [
  ...stripeGetPaymentMethodsBody,
  validateBody,
]

export const stripePaymentIntentMiddlewares = [
  ...stripePaymentIntentBody,
  validateBody,
]

export const stripeManualIntentMiddlewares = [
  ...stripeManualIntentBody,
  validateBody,
]

export const stripeChargeMiddlewares = [
  ...stripeChargeBody,
  validateBody,
]

export const stripeSetupIntentMiddlewares = [
  ...stripeSetupIntentBody,
  validateBody,
]

export const stripeChargeCardOffSessionMiddlewares = [
  ...stripeChargeCardOffSessionBody,
  validateBody,
]

