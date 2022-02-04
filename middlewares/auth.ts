import { checkSchema } from "express-validator";

/**
 * @Login VALIDATIONS
 */
export const loginValidations = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },

  password: {
    notEmpty : {
      errorMessage: 'The password is required',
      bail: true
    }, 
  },
});
