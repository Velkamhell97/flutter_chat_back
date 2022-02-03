"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_result_1 = require("express-validator/src/validation-result");
const validate = (req, res, next) => {
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
};
exports.default = validate;
//# sourceMappingURL=validate.js.map