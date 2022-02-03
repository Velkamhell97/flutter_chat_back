import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import socketIO = require('socket.io');

import dbConnection from '../database/config';

import socketController from '../sockets/controller';

import { Auth, Users } from '../routes';

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
      auth  : '/api/auth',
      users : '/api/users' 
    } 
    
    this.database();

    this.middlewares();

    this.routes();

    this.sockets();
  }

  async database(){
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.paths.auth, Auth)
    
    this.app.use(this.paths.users, Users)
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server Listening in port ${this.port}`);
    })
  }
}

export default Server;
