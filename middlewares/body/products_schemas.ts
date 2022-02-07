import { checkSchema } from "express-validator/src/middlewares/schema";

/**
 * @Schema create products validation schema
 */
 export const createProductBody = checkSchema({
  name: {
    notEmpty : {
      errorMessage: 'The name is required'
    }
  },

  price: {
    notEmpty : {
      errorMessage: 'The price is required',
      bail: true
    },
    isNumeric : {
      errorMessage: 'The price must be a number'
    },
  },

  category: {
    notEmpty: {
      errorMessage: 'The category is required',
    },
  }
});

/**
 * @Schema update products validation schema
 */
 export const updateProductBody = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'invalid ID'
    }
  },

  price: {
    optional: {
      options: {nullable: true},
    },
    isNumeric : {
      errorMessage: 'The price must be a number'
    },
  },
});

/**
 * @Schema update products validation schema
 */
 export const deleteProductBody = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'invalid ID'
    }
  },
});