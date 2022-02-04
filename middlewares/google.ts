import { checkSchema } from "express-validator/src/middlewares/schema";

/**
 * @Google VALIDATIONS
 */
 export const googleValidations = checkSchema({
  id_token: {
    notEmpty: {
      errorMessage: 'The id_token is required'
    }
  },

});
