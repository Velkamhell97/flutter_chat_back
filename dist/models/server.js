"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socketIO = require("socket.io");
const config_1 = __importDefault(require("../database/config"));
const controller_1 = __importDefault(require("../sockets/controller"));
const routes_1 = require("../routes");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
        this.server = http_1.default.createServer(this.app);
        this.io = new socketIO.Server(this.server);
        this.paths = {
            auth: '/api/auth',
            users: '/api/users'
        };
        this.database();
        this.middlewares();
        this.routes();
        this.sockets();
    }
    database() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, config_1.default)();
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.paths.auth, routes_1.Auth);
        this.app.use(this.paths.users, routes_1.Users);
    }
    sockets() {
        this.io.on('connection', (socket) => (0, controller_1.default)(socket, this.io));
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server Listening in port ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map