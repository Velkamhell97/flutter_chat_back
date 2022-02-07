import { createProductBody, deleteProductBody, updateProductBody } from './body/products_schemas';
import { validateProduct, validateProductAuthor, validateProductCategory, validateProductID } from './validations/products_validations';
import { validateBody, validateJWT, validatePermissions } from './validations/shared_validations';

export const getProductyByIdMiddlewares = [
  validateProductID
]

export const createProductMiddlewares = [
  validateJWT,
  ...createProductBody,
  validateBody,
  validateProductCategory,
  validateProduct
]

export const updateProductMiddlewares = [
  validateJWT,
  validateProductID,
  ...updateProductBody,
  validateBody,
  validateProductCategory,
  validateProduct,
  validateProductAuthor
]

export const deleteProductMiddlewares = [
  validateJWT,
  validateProductID,
  ...deleteProductBody,
  validateBody,
  validateProductAuthor,
  validatePermissions
]

