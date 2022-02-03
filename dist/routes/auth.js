"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  path: api/auth
*/
const express_1 = require("express");
const validations_1 = require("../middlewares/validations");
const auth_1 = require("../middlewares/auth");
const auth_2 = require("../controller/auth");
const router = (0, express_1.Router)();
//-Al parecer se utiliza para renovar el jwt
router.get('/', validations_1.validateJWT, auth_2.renewToken);
// router.post('/login', loginValidations, validateBody, login); //-->Forma 1
router.post('/login', auth_1.loginValidations, validations_1.validateBody, validations_1.validateLoginEmail, validations_1.validateLoginPassword, auth_2.login); //-->Forma 2
exports.default = router;
//# sourceMappingURL=auth.js.map