import express, { Application } from 'express';
import cors from 'cors';

import { UsersRouter } from '../../routes';


//-Forma 2 de inicializar un objeto se crea una interfaz que describa sus tipos, si se tiene un subobjeto se
//-crea otra interfaz para ese subobjeto, esta forma tiene ventajas, como el tipado, los parametros opcionales ?:
//-propiedades que no se pueden modificar, propiedades adicionaeles, y varias ventajas mas
interface Paths {
  auth       : string, 
  categories : string,
  products   : string,
  searchs    : string,
  users      : string,
  uploads    : string,
}

class ServerTest {
  private app : Application;
  private port : string;

  //-Forma 1 de inicializar un objeto en typescript, este difiere los tipos de cada propiedad
  private paths;

  //-Forma 2
  // private paths : Paths;

  //-Tambien se pueden crear mapas
  // private paths : Map<string,string>;

  //-Esta forma se llama index signatures, es como mapas pero se acceden de otra manera
  // private paths : {[key: string] : string};

  //-Finalmente existen otros objetos llamados Record, que tambien permiten crear un tipo de mapas
  //-pero mas complejos, ya que pueden almacenar objetos como valores, ademas de limitar las posibles entradas
  // private paths : Record<string, string>;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8080';

    //-Forma 1 o 2, se aplican diferentes validaciones para ambas
    this.paths = {
      auth       : '/api/auth',
      categories : '/api/categories',
      products   : '/api/products',
      searchs    : '/api/searchs',
      users      : '/api/users',
      uploads    : '/api/uploads',
    }    

    //-Mapas
    // this.paths = new Map<string, string>([
    //   ["auth", "/api"],
    //   ["auth", "/api"],
    // ])

    // this.paths.get("auth");

    //-Index signatures, se pueden definir las llaves como propiedades, pero es mejor manejar el tipado para el acceso
    //-para el caso de string en especifico se puede pasar la key como un string o una propiedad
    // this.paths = {
    //   'auth'       : '/api/auth',
    //   'categories' : '/api/categories',
    //   'products'   : '/api/products',
    //   1    : '/api/searchs', 
    //   2      : '/api/users',
    //   uploads    : '/api/uploads',
    // }    

    // this.paths['auth'];
    // this.paths['search'];
    // this.paths[1];
    // this.paths['2'];
    
    //-Al igual que en el anterior si la llave es un string se puede colocar un string o la propiedad
    //-si el tipo de entrada es un objeto type o interfaz, se puede acceder mediante el ., si es un valor
    //-primitivo como string u demas se debe acceder con el parentesis
    // this.paths = {
    //   auth       : '/api/auth',
    //   categories : '/api/categories',
    //   products   : '/api/products',
    //   searchs    : '/api/searchs',
    //   users      : '/api/users',
    //   uploads    : '/api/uploads',
    // } 
    
    // this.paths['auth']

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.paths.auth, UsersRouter)
  }


  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server Listening in port ${this.port}`);
    })
  }
}

export default ServerTest;
