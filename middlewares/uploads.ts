import { validateProductID } from "./validations/products_validations";
import { validateJWT, validateSingleFile } from "./validations/shared_validations";
import { validateMultipleFiles } from "./validations/uploads_validations";
import { validateUserID } from "./validations/user_validations";

export const uploadFilesMiddlewares = [
  validateMultipleFiles(
    ['image','post'], 
    ['jpg','jpeg','png','gif'],
  )
]

export const uploadChatFileMiddlewares = [
  validateJWT,
  validateSingleFile('file', ['jpg', 'jpeg', 'webp', 'png', 'wav'])
]

export const getUserAvatarMiddlewares = [
  validateUserID,
]

export const getProductImgMiddlewares = [
  validateProductID,
]