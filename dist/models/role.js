"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    role: { type: String, required: [true, 'El rol es obligatorio'] }
});
const roleModel = (0, mongoose_1.model)('Role', roleSchema);
exports.default = roleModel;
//# sourceMappingURL=role.js.map