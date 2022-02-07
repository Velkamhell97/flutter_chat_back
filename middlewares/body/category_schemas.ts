import { checkSchema } from "express-validator";

/**
 * @Schema create category validation schema
 */
 export const createCategoryBody = checkSchema({
  name: {
    notEmpty : {
      errorMessage: 'The name is required'
    }
  },
});

/**
 * @Schema update category validation schema
 */
export const updateCategoryBody = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
    },
  },
});

/**
 * @Schema delete category validation schema
 */
export const deleteCategoryBody = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
    },
  },
});