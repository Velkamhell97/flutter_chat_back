import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';

import { User } from '../models';
import { generateJWT } from "../helpers";


/**
 * @path /api/users/ : GET
 */
export const getUsers = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;

  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).populate('role','role').skip(Number(from)).limit(Number(limit))
  ])

  res.json({
    msg: 'Users get successfully',
    total: total,
    users,
    count: users.length,
  })
}

/**
 * @path /api/users/ : POST
 */
export const createUser = async (req: Request, res: Response) => {
  const { password, ...userData } = req.body;

  const salt = bcryptjs.genSaltSync();
  userData.password = bcryptjs.hashSync(password, salt);

  const user  = new User(userData);

  try {
    await user.save();
    await user.populate('role', 'role')

    generateJWT(user.id).then((token) => {
      return res.json({
        msg: 'User saved successfully',
        user,
        token
      })
    }).catch((error) => {
      console.log(error);
      return res.status(400).json(error)
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User saved failed',
      error
    })
  }
}

/**
 * @path /api/users/:id : PUT
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, ...rest } = req.body;

  if(password){
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  
  try {
    const user = await User.findByIdAndUpdate(id, rest, { new: true });
    await user!.populate('role', 'role');

    return res.json({
      msg: 'User update successfully',
      user
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User update failed',
      error
    })
  }
}

/**
 * @path /api/users/:id : DELETE
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, { state: false }, { new: true })
    await user!.populate('role', 'role')

    return res.json({
      msg: 'User delete successfully',
      user
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: 'User delete failed',
      error
    })
  }
}

