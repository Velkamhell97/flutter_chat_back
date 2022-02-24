import { googleBody, loginBody, resetPasswordBody, sendResetTokenBody } from "./body/auth_schemas"
import { validateLogin, validateResetEmail, validateResetToken } from "./validations/auth_validations"
import { validateBody, validateJWT } from "./validations/shared_validations"

export const renewTokenMiddlewares = [
  validateJWT
]

export const loginMiddlewares = [
  ...loginBody,
  validateBody,
  validateLogin
]

export const sendResetTokenMiddlewares = [
  ...sendResetTokenBody,
  validateBody,
  validateResetEmail
]

export const resetPasswordMiddlewares = [
  ...resetPasswordBody,
  validateBody,
  validateResetToken
]

export const googleSignInMiddlewares = [
  ...googleBody,
  validateBody
]