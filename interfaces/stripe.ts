import { Request } from 'express';

export interface StripeRequest extends Request {
  body : StripeBody,
}

interface StripeBody {
  email: string,
  amount: number,
  saveCard : boolean,
  paymentToken: string,
  // items: object[] //Al parecer envia parametros adicionales
  currency: string,
  paymentMethodId ?: string,
  paymentIntentId ?: string,
  paymentMethodTypes ?: string[],
  cvcToken ?: string,
  useStripeSdk ?: boolean,
  requestThreeDSecure ?: 'any' | 'automatic',
  client ?: 'ios' | 'android',
}

