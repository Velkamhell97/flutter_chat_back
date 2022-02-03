"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (error, token) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY, {}, (error, payload) => {
            if (error) {
                //-El error generado es muy largo, por eso se envia solo el mensaje
                reject(error.message);
            }
            else {
                resolve(payload);
            }
        });
    });
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=helpers.js.map