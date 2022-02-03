import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import bcryptjs from 'bcryptjs';

import { verifyJWT } from "../helpers/helpers";
import { Role, User } from "../models";

export const validateJWT = (req : Request, res : Response, next: NextFunction) => {
  const token = req.header('x-token');

  if(!token){
    return res.status(401).json({
      msg: 'There is not token in request'
    })
  }

  verifyJWT(token).then(async (payload) => {
    const authUser = await User.findById(payload.uid);

    if(!authUser || authUser.state == false){
      return res.status(401).json({
        msg: `Invalid token (user not found)`
      })
    }

    // req.authUser = authUser; //-->Se necesita interfaz
    req.body.authUser = authUser //--> En el boyd
    res.locals.authUser = authUser //--> En los locals
    
    next();
  }).catch((error) => {
    console.log(error);

    return res.status(401).json({
      msg: 'Invalid Token (expired or unsigned)'
    })
  })
}

export const validateBody = (req : Request, res : Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next();
}

export const validateRole = async (req : Request, res : Response, next: NextFunction) => {
  const { role } = req.body;

  if(!role) {
    return next();
  }
  
  const validRole = await Role.findOne({role});

  if(!validRole){
    return res.status(401).json({
      msg: `The role ${role} does not exist`
    })
  } else {
    res.locals.roleID = validRole.id;

    next();
  }
}

export const validatePermissions = async (req : Request, res : Response, next: NextFunction) => {
  const authUser = res.locals.authUser;

  const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];

  const authUserRole = await Role.findById(authUser.role);

  if(!authUserRole || !validRoles.includes(authUserRole.role)){
    return res.status(401).json({
      msg: `Only the roles: ${validRoles} can delete users, actual role: ${authUser.role}`
    })
  } else {
    next()
  }
}

export const validateLoginEmail = async (req : Request, res : Response, next: NextFunction) => {
  const { email } = req.body
  
  const user = await User.findOne({email});

  if(!user || user.state == false){
    throw new Error('The email or password is incorrect')
  } else {
    res.locals.user = user;

    next();
  }
}

export const validateLoginPassword = async (req : Request, res : Response, next: NextFunction) => {
  const user = res.locals.user;

  const matchPassword = bcryptjs.compareSync(req.body.password, user.password)

  if(!matchPassword) {
    throw new Error('The email or password is incorrect')
  } else {
    next()
  }
}





