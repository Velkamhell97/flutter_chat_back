/*
  path: /api/users
*/
import { Router } from "express";

//-Custom Middlewares
import { validateBody, validateJWT, validatePermissions, validateRole } from "../middlewares/validations";

//-Body Validations
import { createUserValidations, updateUserValidations, deleteUserValidations } from "../middlewares/users";

//-Routes Controllers
import { getUsers, createUser, updateUser, deleteUser } from "../controller/users";

const router = Router();

router.get('/', getUsers);

// router.post('/', createUserValidations, validateBody, createUser); //-->Forma 1
router.post('/', createUserValidations, validateBody, validateRole, createUser); //-->Forma2

// router.put('/:id', updateUserValidations, validateBody, updateUser); //-->Forma 1
router.put('/:id', updateUserValidations, validateBody, validateRole, updateUser); //-->Forma 2

// router.delete('/:id', validateJWT, deleteUserValidations, validateBody, deleteUser); //-->Forma 1
router.delete('/:id', validateJWT, deleteUserValidations, validateBody, validatePermissions, deleteUser); //-->Forma 2

export default router;

/** Validacion sin esquema
 * router.post('/', [
 *  check('name', 'El nombre es obligatorio').not().isEmpty(),
 *  check('password', 'El password debe ser mayor a 6 caracteres').isLength({min: 6}),
 *  check('email', 'el correo no es valido').isEmail(),
 *  validate
 * ], postUser)
 */
