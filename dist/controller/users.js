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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const helpers_1 = require("../helpers/helpers");
/*
  path --> /api/users/ : GET
*/
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };
    const [total, users] = yield Promise.all([
        models_1.User.countDocuments(query),
        models_1.User.find(query).populate('role', 'role').skip(Number(from)).limit(Number(limit))
    ]);
    res.json({
        msg: 'Users get successfully',
        total: total,
        users,
        count: users.length,
    });
});
exports.getUsers = getUsers;
/*
  path --> /api/users/ : POST
*/
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password, role } = _a, data = __rest(_a, ["password", "role"]);
    // const roleID = req.roleID; //--> Si se usa la interfaz (express validator - CustomRequest)
    // const roleID = req.body.roleID; //--> Si no se usa la interfaz (express validator)
    // const roleID = (await Role.findOne({role}))?.id //--> Si se evalua el rol aqui
    const roleID = res.locals.roleID; //--> Si se usa un custom middleware
    data.role = roleID;
    const salt = bcryptjs_1.default.genSaltSync();
    data.password = bcryptjs_1.default.hashSync(password, salt);
    const user = new models_1.User(data);
    try {
        yield user.save();
        yield user.populate('role', 'role'); //--> Solo para visualizar en la respuesta json el objeto rol bien
        (0, helpers_1.generateJWT)(user.id).then((token) => {
            return res.json({
                msg: 'User saved successfully',
                user,
                token
            });
        }).catch((error) => {
            console.log(error);
            return res.status(400).json(error);
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'User saved failed',
            error
        });
    }
});
exports.createUser = createUser;
/*
  path --> /api/users/ : PUT
*/
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.body, { _id, password, role } = _b, rest = __rest(_b, ["_id", "password", "role"]);
    const { id } = req.params;
    if (password) {
        const salt = bcryptjs_1.default.genSaltSync();
        rest.password = bcryptjs_1.default.hashSync(password, salt);
    }
    if (role) {
        // const roleID = req.roleID; //--> Si se usa la interfaz (express validator)
        // const roleID = req.body.roleID; //--> Si no se usa la interfaz (express validator)
        // const roleID = (await Role.findOne({role}))?.id //--> Si se evalua el rol aqui
        const roleID = res.locals.roleID; //--> Si se usa un custom middleware
        rest.role = roleID;
    }
    try {
        //-Como en el middleware no se premitira un id de un registro eliminado (state en false) en este punto
        //-no abra problemas ya que todos los id estan activos
        const user = yield models_1.User.findByIdAndUpdate(id, rest, { new: true });
        yield user.populate('role', 'role');
        return res.json({
            msg: 'User update successfully',
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'User update failed',
            error
        });
    }
});
exports.updateUser = updateUser;
/*
  path --> /api/users/ : DELETE
*/
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        //Borrar fisicamente
        // const user = await User.findByIdAndDelete(id);
        //Borrar logicamente
        const user = yield models_1.User.findByIdAndUpdate(id, { state: false }, { new: true });
        return res.json({
            msg: 'User delete successfully',
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'User delete failed',
            error
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.js.map