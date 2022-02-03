import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import bcryptjs from 'bcryptjs';

import { verifyJWT } from "../helpers";
import { Role, User } from "../models";

/**
 * @Validate JWT and put auth user in res.locals
 */
export const validateJWT = (req : Request, res : Response, next: NextFunction) => {
  const token = req.header('x-token');

  if(!token){
    return res.status(401).json({
      error: 'Invalid token',
      msg: 'There is not token in request'
    })
  }

  verifyJWT(token).then(async (payload) => {
    const authUser = await User.findById(payload.uid);

    if(!authUser || authUser.state == false){
      return res.status(401).json({
        error: 'Invalid token',
        msg: `Auth user not found in database`
      })
    }

    res.locals.authUser = authUser
    
    next();
  }).catch((error) => {
    console.log(error);

    return res.status(401).json({
      error: 'Invalid token',
      msg: 'Token expired or unsigned'
    })
  })
}

/**
 * @Validate BODY FIELDS FROM EXPRESS VALIDATOR
 */
export const validateBody = (req : Request, res : Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next();
}

/**
 * @Validate BODY FIELDS FROM EXPRESS VALIDATOR
 */
 export const validateEmail = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;

  if(!email){
    return next();
  }

  const dbUser = await User.findOne({email, _id: {$ne: id}})

  if(dbUser){
    return res.status(401).json({
      error: 'Duplicate email',
      msg: `The email ${email} is already in use`,
    })
  }

  next();
}

/**
 * @Validate user role and put the id if is valid 
 */
export const validateRole = async (req : Request, res : Response, next: NextFunction) => {
  const { role } = req.body;

  if(!role) {
    return next();
  }
  
  const dbRole = await Role.findOne({role});

  if(!dbRole){
    return res.status(401).json({
      error: 'Invalid role',
      msg: `The role ${role} does not exist`,
    })
  } else {
    req.body.role = dbRole.id;

    next();
  }
}

/**
 * @Validate BODY FIELDS FROM EXPRESS VALIDATOR
 */
 export const validateMongoID = async (req : Request, res : Response, next: NextFunction) => {
  const { id } = req.params;

  const dbUser = await User.findById(id);

  if(!dbUser || !dbUser.state){
    return res.status(401).json({
      error: 'Invalid user ID',
      msg: `The user does not exist in the database`,
    })
  }

  next();
}

/**
 * @Validate IF CURRENT ROLE HAS SPECIFIC PERMISSIONS
 */
export const validatePermissions = async (req : Request, res : Response, next: NextFunction) => {
  const authUser = res.locals.authUser;

  const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];

  const authUserRole = await Role.findById(authUser.role);

  if(!authUserRole || !validRoles.includes(authUserRole.role)){
    return res.status(401).json({
      error: 'Permissions denied',
      msg: `Only the roles: ${validRoles} can delete users, actual role: ${authUserRole!.role}`
    })
  } else {
    next()
  }
}

/**
 * @Validate LOGIN
 */
 export const validateLogin = async (req : Request, res : Response, next: NextFunction) => {
  const { email, password } = req.body
  
  const user = await User.findOne({email});

  if(!user || user.state == false){
    throw new Error('The email or password is incorrect')
  }

  const matchPassword = bcryptjs.compareSync(password, user.password)

  if(!matchPassword) {
    throw new Error('The email or password is incorrect')
  } else {
    res.locals.authUser = user;

    next()
  }
}