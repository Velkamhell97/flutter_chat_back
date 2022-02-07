import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";

import { verifyJWT } from "../../helpers";
import { Role, User } from "../../models";

/**
 * @Middleware validate jwt header (return auth user)
 */
export const validateJWT = (req : Request, res : Response, next: NextFunction) => {
  const token = req.header('x-token');

  if(!token){
    return res.status(401).json({
      msg: 'There is not token in request',
      error: 'Invalid token',
    })
  }

  verifyJWT(token).then(async (payload) => {
    const authUser = await User.findById(payload.uid);

    if(!authUser || authUser.state == false){
      return res.status(401).json({
        msg: `Auth user not found in database`,
        error: 'Invalid token',
      })
    }

    res.locals.authUser = authUser
    
    next();
  }).catch((error) => {
    console.log(error);

    return res.status(401).json({
      msg: 'Token expired or unsigned',
      error: 'Invalid token',
    })
  })
}

/**
 * @Middleware validate body schemas
 */
export const validateBody = (req : Request, res : Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next();
}

/**
 * @Middleware validate user permissions
 */
export const validatePermissions = async (req : Request, res : Response, next: NextFunction) => {
  const authUser = res.locals.authUser;

  const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];

  const authUserRole = await Role.findById(authUser.role);

  if(!authUserRole || !validRoles.includes(authUserRole.role)){
    return res.status(401).json({
      msg: `Only the roles: ${validRoles} can delete, actual role: ${authUserRole!.role}`,
      error: 'Permissions denied',
    })
  } else {
    next()
  }
}