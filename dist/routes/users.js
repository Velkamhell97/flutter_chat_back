"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  path: /api/users
*/
const express_1 = require("express");
//-Custom Middlewares
const validations_1 = require("../middlewares/validations");
//-Body Validations
const users_1 = require("../middlewares/users");
//-Routes Controllers
const users_2 = require("../controller/users");
const router = (0, express_1.Router)();
router.get('/', users_2.getUsers);
// router.post('/', createUserValidations, validateBody, createUser); //-->Forma 1
router.post('/', users_1.createUserValidations, validations_1.validateBody, validations_1.validateRole, users_2.createUser); //-->Forma2
// router.put('/:id', updateUserValidations, validateBody, updateUser); //-->Forma 1
router.put('/:id', users_1.updateUserValidations, validations_1.validateBody, validations_1.validateRole, users_2.updateUser); //-->Forma 2
// router.delete('/:id', validateJWT, deleteUserValidations, validateBody, deleteUser); //-->Forma 1
router.delete('/:id', validations_1.validateJWT, users_1.deleteUserValidations, validations_1.validateBody, validations_1.validatePermissions, users_2.deleteUser); //-->Forma 2
exports.default = router;
/** Validacion sin esquema
 * router.post('/', [
 *  check('name', 'El nombre es obligatorio').not().isEmpty(),
 *  check('password', 'El password debe ser mayor a 6 caracteres').isLength({min: 6}),
 *  check('email', 'el correo no es valido').isEmail(),
 *  validate
 * ], postUser)
 */
//# sourceMappingURL=users.js.map