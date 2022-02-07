import { checkSchema } from "express-validator";

/**
 * @Schema login validation schema
 */
export const loginBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },

  password: {
    notEmpty : {
      errorMessage: 'The password is required',
    }, 
  },
});

/**
 * @Schema google sign validation schema
 */
 export const googleBody = checkSchema({
  id_token: {
    notEmpty: {
      errorMessage: 'The id_token is required'
    }
  },
});

