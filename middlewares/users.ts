import { check } from 'express-validator';

import { 
    createUserBody, 
    deleteUserBody, 
    updateUserBody 
  } from './body/user_schemas';

  import { 
    validateBody, 
    validateJWT, 
    validatePermissions, 
    validateSingleFile
  } from './validations/shared_validations';

  import { 
    validateEmail, 
    validateRole, 
    validateUserID
  } from './validations/user_validations';

  export const getUsersConnectedMiddlewares = [
    validateJWT,
  ]

  export const getUserByIdMiddlewares = [
    check('id', 'Invalid ID').isMongoId(),
    validateBody,
    validateUserID
  ]

  export const getUserCategoriesMiddlewares = [
    check('id', 'Invalid ID').isMongoId(),
    validateBody,
    validateUserID
  ]

  export const getUserChatMessagesMiddlewares = [
    validateJWT,
    validateUserID,
  ];

  export const createUserMiddlewares = [
    ...createUserBody,
    validateBody,
    validateEmail,
    validateRole,
    validateSingleFile('avatar', ['jpg', 'jpeg', 'png'])
  ]

  export const updateUserMiddlewares = [
    validateUserID,
    ...updateUserBody,
    validateBody,
    validateEmail,
    validateRole,
    validateSingleFile('avatar', ['jpg', 'jpeg', 'png'])
  ]

  export const deleteUserMiddlewares = [
    validateJWT,
    validateUserID,
    ...deleteUserBody,
    validateBody,
    validatePermissions,
  ]