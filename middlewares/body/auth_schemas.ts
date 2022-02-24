import { checkSchema } from "express-validator";

//->Los schemas solo validan campos del body que no necesiten consultas en la db

/**
 * @schema login validation schema
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
 * @schema reset password validation schema
 */
 export const sendResetTokenBody = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },
});

/**
 * @schema reset password validation schema
 */
 export const resetPasswordBody = checkSchema({
  resetToken: {
    isLength: {
      errorMessage: 'The reset password token is a 5 character token',
      options: {min: 5, max: 5}
    }
  },

  password: {
    isLength : {
      errorMessage: 'The password must have at least 7 characters',
      options: {min: 6}
    }
  },
});

/**
 * @schema google sign validation schema
 */
 export const googleBody = checkSchema({
  id_token: {
    notEmpty: {
      errorMessage: 'The id_token is required'
    }
  },
});

