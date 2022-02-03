"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("../routes/auth"));
class ServerTest {
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
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
        //-Forma 1 o 2, se aplican diferentes validaciones para ambas
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            searchs: '/api/searchs',
            users: '/api/users',
            uploads: '/api/uploads',
        };
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
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.paths.auth, auth_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server Listening in port ${this.port}`);
        });
    }
}
exports.default = ServerTest;
//# sourceMappingURL=server_test.js.map