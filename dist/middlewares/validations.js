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
exports.validateLoginPassword = exports.validateLoginEmail = exports.validatePermissions = exports.validateRole = exports.validateBody = exports.validateJWT = void 0;
const validation_result_1 = require("express-validator/src/validation-result");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helpers_1 = require("../helpers/helpers");
const models_1 = require("../models");
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'There is not token in request'
        });
    }
    (0, helpers_1.verifyJWT)(token).then((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const authUser = yield models_1.User.findById(payload.uid);
        if (!authUser || authUser.state == false) {
            return res.status(401).json({
                msg: `Invalid token (user not found)`
            });
        }
        // req.authUser = authUser; //-->Se necesita interfaz
        req.body.authUser = authUser; //--> En el boyd
        res.locals.authUser = authUser; //--> En los locals
        next();
    })).catch((error) => {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid Token (expired or unsigned)'
        });
    });
};
exports.validateJWT = validateJWT;
const validateBody = (req, res, next) => {
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
};
exports.validateBody = validateBody;
const validateRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.body;
    if (!role) {
        return next();
    }
    const validRole = yield models_1.Role.findOne({ role });
    if (!validRole) {
        return res.status(401).json({
            msg: `The role ${role} does not exist`
        });
    }
    else {
        res.locals.roleID = validRole.id;
        next();
    }
});
exports.validateRole = validateRole;
const validatePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = res.locals.authUser;
    const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];
    const authUserRole = yield models_1.Role.findById(authUser.role);
    if (!authUserRole || !validRoles.includes(authUserRole.role)) {
        return res.status(401).json({
            msg: `Only the roles: ${validRoles} can delete users, actual role: ${authUser.role}`
        });
    }
    else {
        next();
    }
});
exports.validatePermissions = validatePermissions;
const validateLoginEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield models_1.User.findOne({ email });
    if (!user || user.state == false) {
        throw new Error('The email or password is incorrect');
    }
    else {
        res.locals.user = user;
        next();
    }
});
exports.validateLoginEmail = validateLoginEmail;
const validateLoginPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const matchPassword = bcryptjs_1.default.compareSync(req.body.password, user.password);
    if (!matchPassword) {
        throw new Error('The email or password is incorrect');
    }
    else {
        next();
    }
});
exports.validateLoginPassword = validateLoginPassword;
//# sourceMappingURL=validations.js.map