import { checkSchema } from "express-validator";


/**
 * @schema setup get payment methods validation schema
 */
 export const stripeGetPaymentMethodsBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },
});


/**
 * @schema payment intent validation schema
 */
 export const stripePaymentIntentBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },

  amount: {
    notEmpty: {
      errorMessage: 'The amount is required',
      bail: true
    },
    isNumeric: {
      errorMessage: 'The amount must be string', 
    },
  },

  currency: {
    notEmpty: {
      errorMessage: 'The currency is required',
      bail: true,
    },
    isString: {
      errorMessage: 'The currency must be string', 
    },
  }
});


/**
 * @schema payments validation schema (verifica varios casos)
 */
 export const stripeManualIntentBody = checkSchema({
  
});


/**
 * @schema charge validation schema
 */
 export const stripeChargeBody = checkSchema({
  paymentToken: {
    notEmpty : {
      errorMessage: 'The payment token is required',
    },
  },
});


/**
 * @schema setup intent validation schema
 */
 export const stripeSetupIntentBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },
});


/**
 * @schema charge card off session validation schema
 */
 export const stripeChargeCardOffSessionBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },
});


