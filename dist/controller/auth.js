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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.renewToken = void 0;
const helpers_1 = require("../helpers/helpers");
/*
  path --> /api/auth : GET
*/
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const authUser = req.authUser; //--> En el req (se necesita interfaz)
    // const authUser = req.body.authUser; //--> En el body
    const authUser = res.locals.authUser; //--> En los locals
    yield authUser.populate('role', 'role');
    (0, helpers_1.generateJWT)(authUser.id).then((token) => {
        res.json({
            msg: 'Token renew',
            user: authUser,
            token
        });
    }).catch((error) => {
        console.log(error);
        return res.status(400).json(error);
    });
});
exports.renewToken = renewToken;
//-Se podrian crear interfaces en cada controlador para manejar tipadas las respuestas
/*
  path --> /api/auth/login : POST
*/
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-Se recibe de la validacion del input y password, asi no se hace otra operacion en la db
    // const user = req.user; //-->Forma 1 (interfaz)
    // const user = req.body.user; //--> Forma 2
    const user = res.locals.user; //--> Forma 3
    yield user.populate('role', 'role');
    (0, helpers_1.generateJWT)(user.id).then((token) => {
        res.json({
            msg: 'Login successfully',
            user,
            token
        });
    }).catch((error) => {
        console.log(error);
        return res.status(400).json(error);
    });
});
exports.login = login;
//# sourceMappingURL=auth.js.map