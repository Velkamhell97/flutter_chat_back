// import dotenv from 'dotenv';
import Server from './models/server';

//-Con el preload node -r dotenv/config dist/app.js, se pueden usar los env, en los constructores de las clases
//-no se sabe si esto afecte en algo en el rendimiento o si tenga problemass con el serverless donde se aloja (con heroku no hubo problema)
// dotenv.config();

const server = new Server();

server.listen();