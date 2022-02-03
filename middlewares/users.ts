import { checkSchema } from "express-validator";

/**
 * @Create VALIDATIONS
 */
export const createUserValidations = checkSchema({
  name: {
    notEmpty : {
      errorMessage: 'The name is required'
    }
  },

  email: {
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },

  password: {
    isLength : {
      errorMessage: 'The password must have at least 7 characters',
      options: {min: 6}
    }
  },

  role: {
    notEmpty: {
      errorMessage: 'The Role is required',
    },
  }
});

/**
 * @Update VALIDATIONS
 */
export const updateUserValidations = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
    },
  },

  email: {
    optional: {
      options: {nullable: true},
    }, 
    isEmail : {
      errorMessage: 'Invalid email',
    },
  },

  password: {
    optional: {
      options: {nullable: true}
    },
    isLength : {
      errorMessage: 'The password must have at least 7 characters',
      options: {min: 6},
    }
  },
});

/**
 * @Delete VALIDATIONS
 */
export const deleteUserValidations = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
    },
  },
});