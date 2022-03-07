/**
 * @path /api/users
 */
import { Router } from "express";
import multer from 'multer';

//-Routes Middlewares
import { 
  createUserMiddlewares, 
  deleteUserMiddlewares, 
  getUserByIdMiddlewares, 
  getUserCategoriesMiddlewares, 
  getUserChatMessagesMiddlewares, 
  getUsersConnectedMiddlewares, 
  updateUnreadUserMiddlewares, 
  updateUserMiddlewares 
} from "../middlewares";

//-Routes Controllers
import { 
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getUserCategoriesController,
  getUsersController,
  getUsersConnectedController,
  getUserChatMessages,
  updateUnreadUserController,
} from "../controller/users";
import { Message } from "../models";

const router = Router();

const upload = multer({dest: '/tmp/'})

router.get('/', getUsersController);

router.get('/connected', 
  getUsersConnectedMiddlewares,
  getUsersConnectedController,
);

router.get('/:id',
  getUserByIdMiddlewares,
  getUserByIdController 
);

router.get('/:id/categories',
  getUserCategoriesMiddlewares,
  getUserCategoriesController
);

router.get('/messages/:id',  //-El id es la persona destino :to
  getUserChatMessagesMiddlewares,
  getUserChatMessages
);

router.post('/', 
  upload.any(),
  createUserMiddlewares,
  createUserController,
);

router.put('/:id', 
  upload.any(),
  updateUserMiddlewares,
  updateUserController,
); 

router.put('/unread/:from', 
  upload.any(),
  updateUnreadUserMiddlewares,
  updateUnreadUserController,
); 

router.delete('/:id', 
  deleteUserMiddlewares,
  deleteUserController
); 

router.delete('/messages/:all', 
  async (req, res) => {
    await Message.deleteMany({}) ;
    res.json({
      msg: 'Messages deleted Succesfully'
    })
  }
); 

export default router;