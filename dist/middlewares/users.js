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
exports.deleteUserValidations = exports.updateUserValidations = exports.createUserValidations = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
//-Tener en cuenta que las validaciones de aqui son diferentes a las de la base de datos y estas se utilizan
//-precisamente para que la base de datos no tenga error y haya caer el servidor
/* Create User Validations */
exports.createUserValidations = (0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: 'The name is required'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Invalid email',
            bail: true,
        },
        custom: {
            options: (email) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield models_1.User.findOne({ email });
                if (user) {
                    throw new Error(`The email ${email} is already in use`);
                }
            })
        }
    },
    password: {
        isLength: {
            errorMessage: 'The password must have at least 7 characters',
            options: { min: 6 }
        }
    },
    role: {
        notEmpty: {
            errorMessage: 'The Role is required',
            bail: true
        },
        custom: {
            options: (role, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const validRole = yield models_1.Role.findOne({ role });
                if (!validRole) {
                    throw new Error(`The role ${role} does not exist`);
                }
                else {
                    // req.roleID = validRole.id; //--> Se necesita interfaz en el controller
                    req.body.roleID = validRole.id;
                }
            }),
        }
    }
});
/* Update User Validations */
exports.updateUserValidations = (0, express_validator_1.checkSchema)({
    id: {
        isMongoId: {
            errorMessage: 'Invalid ID',
            bail: true
        },
        custom: {
            options: (id) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield models_1.User.findById(id);
                if (!user || user.state == false) {
                    throw new Error(`The user does not exist in the database`);
                }
            })
        }
    },
    email: {
        optional: {
            options: { nullable: true },
        },
        isEmail: {
            errorMessage: 'Invalid email',
            bail: true
        },
        custom: {
            options: (email, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id; //Se debe castear asi
                const user = yield models_1.User.findOne({ email });
                //Un usuario podria asignar un email de un usuario eliminado (state en false), aceptable
                if (user && (user === null || user === void 0 ? void 0 : user.id) != id) {
                    throw new Error(`The email ${email} is already in use`);
                }
            })
        }
    },
    password: {
        optional: {
            options: { nullable: true }
        },
        isLength: {
            errorMessage: 'The password must have at least 7 characters',
            options: { min: 6 },
        }
    },
    role: {
        optional: {
            options: { nullable: true }
        },
        custom: {
            options: (role, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const validRole = yield models_1.Role.findOne({ role });
                if (!validRole) {
                    throw new Error(`The role ${role} does not exist`);
                }
                else {
                    // req.roleID = validRole.id;
                    req.body.roleID = validRole.id;
                }
            })
        }
    }
});
/* Delete User Validations */
exports.deleteUserValidations = (0, express_validator_1.checkSchema)({
    id: {
        isMongoId: {
            errorMessage: 'Invalid ID',
            bail: true
        },
        custom: {
            options: (id) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield models_1.User.findById(id);
                if (!user || user.state == false) {
                    throw new Error(`The user does not exist in the database`);
                }
            })
        }
    },
    'authUser.role': {
        custom: {
            options: (role) => __awaiter(void 0, void 0, void 0, function* () {
                //Esto se puede extraer en un middelware aparte, y pasar el arreglo o crear otra tabla con los
                //roles permitidos, lo cual es un poco mas profesional, por ahora se dejara asi
                const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];
                const authUserRole = yield models_1.Role.findById(role);
                if (!authUserRole || !validRoles.includes(authUserRole.role)) {
                    throw new Error(`Only the roles: ${validRoles} can delete users, actual role: ${authUserRole === null || authUserRole === void 0 ? void 0 : authUserRole.role}`);
                }
            })
        }
    }
});
//# sourceMappingURL=users.js.map