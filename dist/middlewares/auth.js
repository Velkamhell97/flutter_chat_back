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
exports.loginValidations = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
//-Para no realizar tantas lecturas a la base de datos, se puede dejar la logica que tiene que ver
//-con la db al controlador y que este retorne el error
/* Login Validations */
exports.loginValidations = (0, express_validator_1.checkSchema)({
    email: {
        isEmail: {
            errorMessage: 'Invalid email',
            bail: true //-->Si esta validacion falla no realice la siguiente
        },
        custom: {
            options: (email, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield models_1.User.findOne({ email });
                if (!user || user.state == false) {
                    console.log('primera');
                    throw new Error('The email or password is incorrect');
                }
                else {
                    // req.user = user //--> Se necesita interfaz
                    req.body.user = user;
                }
            }),
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'The password is required',
            bail: true
        },
        custom: {
            options: (password, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const user = req.body.user;
                if (user) {
                    const matchPassword = bcryptjs_1.default.compareSync(password, user.password);
                    if (!matchPassword) {
                        throw new Error('The email or password is incorrect');
                    }
                }
            })
        }
    },
});
//# sourceMappingURL=auth.js.map