import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import socketIO = require('socket.io');

import cloudinary from './cloudinary';

import dbConnection from '../database/config';

import { 
  AuthRouter, 
  UsersRouter, 
  CategoriesRouter, 
  RolesRouter, 
  ProductsRouter, 
  SearchsRouter,
  UploadsRouter,
  PaymentsRouter
} from '../routes';

import { SocketsChat, SocketsIndex, SocketsMobileChat, SocketsRoom, SocketsTickets } from '../sockets/controllers';
import { isAuth } from '../sockets/middlewares';


class Server {
  private app : Application;
  private port : string;

  private server: http.Server;
  private io : socketIO.Server;

  private paths;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8080';

    this.server = http.createServer(this.app);
    this.io = new socketIO.Server(this.server);

    this.paths = {
      roles      : '/api/roles',
      auth       : '/api/auth',
      users      : '/api/users',
      categories : '/api/categories',
      products   : '/api/products',
      searchs    : '/api/searchs',
      uploads    : '/api/uploads',
      payments   : '/api/payments'
    } 
    
    cloudinary.init();

    this.database();

    this.middlewares();

    this.routes();

    this.sockets(); //-Al parecer es necesario que este aqui 
  }

  async database(){
    await dbConnection();
    // this.sockets(); //-La espera causaba que los clientes no se conectaran
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static('public'))

    // this.app.use(fileUpload({useTempFiles : true, createParentPath:true, tempFileDir : '/tmp/'}));
  }

  routes() {
    this.app.use(this.paths.roles, RolesRouter);

    this.app.use(this.paths.auth, AuthRouter);
    
    this.app.use(this.paths.users, UsersRouter);

    this.app.use(this.paths.categories, CategoriesRouter);

    this.app.use(this.paths.products,  ProductsRouter);

    this.app.use(this.paths.searchs, SearchsRouter);

    this.app.use(this.paths.uploads, UploadsRouter);

    this.app.use(this.paths.payments, PaymentsRouter);
  }

  sockets() {
    this.io.of('/').on('connection', (socket) => SocketsIndex(socket, this.io));

    this.io.of('/chat').use(isAuth).on('connection', (socket) => SocketsChat(socket, this.io));

    this.io.of('/mobile-chat').use(isAuth).on('connection', (socket) => SocketsMobileChat(socket, this.io));

    this.io.of('/rooms').use(isAuth).on('connection', (socket) => SocketsRoom(socket, this.io));

    this.io.of('/tickets').on('connection', (socket) => SocketsTickets(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server Listening in port ${this.port}`);
    })
  }
}

export default Server;
