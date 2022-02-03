"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validations = void 0;
const express_validator_1 = require("express-validator");
exports.validations = (0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: 'The name is required'
        }
    },
    password: {
        isLength: {
            errorMessage: 'The password must have at least 7 characters',
            options: { min: 6 }
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Invalid email'
        }
    }
});
//# sourceMappingURL=validate_user_post.js.map