import { createUserBody, deleteUserBody, updateUserBody } from './body/user_schemas';
import { validateBody, validateJWT, validatePermissions } from './validations/shared_validations';
import { validateEmail, validateRole, validateUserID } from './validations/user_validations';

export const getUserByIdMiddlewares = [
  validateUserID
]

export const getUserCategoriesMiddlewares = [
  validateUserID
]

export const createUserMiddlewares = [
  ...createUserBody,
  validateBody,
  validateEmail,
  validateRole,
]

export const updateUserMiddlewares = [
  validateUserID,
  ...updateUserBody,
  validateBody,
  validateEmail,
  validateRole
]

export const deleteUserMiddlewares = [
  validateJWT,
  validateUserID,
  ...deleteUserBody,
  validateBody,
  validatePermissions,
]