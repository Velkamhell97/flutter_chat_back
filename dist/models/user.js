"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'The name is required'] },
    email: { type: String, required: [true, 'The email is required'], unique: true },
    password: { type: String, required: [true, 'The password is required'] },
    avatar: { type: String },
    state: { type: Boolean, default: true },
    online: { type: Boolean, default: false },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', required: true }
});
userSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id, password } = _a, user = __rest(_a, ["__v", "_id", "password"]);
    user.uid = _id;
    return user;
};
const userModel = (0, mongoose_1.model)('User', userSchema);
//-Lo que devuelve al hacer un require o import
exports.default = userModel;
//# sourceMappingURL=user.js.map