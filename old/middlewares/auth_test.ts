import { checkSchema } from "express-validator";
import bcryptjs from 'bcryptjs';

import { User } from "../../models";

//-Para no realizar tantas lecturas a la base de datos, se puede dejar la logica que tiene que ver
//-con la db al controlador y que este retorne el error

/* Login Validations */
export const loginValidations = checkSchema({
  email: {
    isEmail : {
      errorMessage: 'Invalid email',
      bail: true //-->Si esta validacion falla no realice la siguiente
    },
    custom: {
      options : async (email, { req }) => {

        const user = await User.findOne({email});

        if(!user || user.state == false){
          console.log('primera');
          throw new Error('The email or password is incorrect')
        } else {
          // req.user = user //--> Se necesita interfaz
          req.body.user = user;
        }
      },
    }
  },

  password: {
    notEmpty : {
      errorMessage: 'The password is required',
      bail: true
    }, 
    custom: {
      options: async (password, { req }) => {
        const user = req.body.user;

        if(user){
          const matchPassword = bcryptjs.compareSync(password, user.password)

          if(!matchPassword) {
            throw new Error('The email or password is incorrect')
          } 
        }
      }
    }
  },
});