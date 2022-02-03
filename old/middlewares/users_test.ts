import { Request } from "express";
import { checkSchema } from "express-validator";
import { Role, User } from "../../models";

//-Tener en cuenta que las validaciones de aqui son diferentes a las de la base de datos y estas se utilizan
//-precisamente para que la base de datos no tenga error y haya caer el servidor

/* Create User Validations */
export const createUserValidations = checkSchema({
  name: {
    notEmpty : {
      errorMessage: 'The name is required'
    }
  },

  email: {
    isEmail : {
      errorMessage: 'Invalid email',
      bail: true,
    },
    custom: {
      options: async (email) => {
        const user = await User.findOne({email})

        if(user){
          throw new Error(`The email ${email} is already in use`)
        }
      }
    }
  },

  password: {
    isLength : {
      errorMessage: 'The password must have at least 7 characters',
      options: {min: 6}
    }
  },

  role: {
    notEmpty: {
      errorMessage: 'The Role is required',
      bail: true
    },
    custom: {
      options: async (role, { req }) => {
        const validRole = await Role.findOne({role});

        if(!validRole){
          throw new Error(`The role ${role} does not exist`);
        } else {
          // req.roleID = validRole.id; //--> Se necesita interfaz en el controller
          req.body.roleID = validRole.id
        }
      },
    }
  }
});

/* Update User Validations */
export const updateUserValidations = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
      bail: true
    },
    custom: {
      options: async (id) => {
        const user = await User.findById(id);

        if(!user || user.state == false){
          throw new Error(`The user does not exist in the database`)
        }
      } 
    }
  },

  email: {
    optional: {
      options: {nullable: true},
    },
    isEmail : {
      errorMessage: 'Invalid email',
      bail: true
    },
    custom: {
      options: async (email, { req }) => {
        const id = req.params?.id; //Se debe castear asi

        const user = await User.findOne({email})

        //Un usuario podria asignar un email de un usuario eliminado (state en false), aceptable
        if(user && user?.id != id){
          throw new Error(`The email ${email} is already in use`)
        }
      }
    }
  },

  password: {
    optional: {
      options: {nullable: true}
    },
    isLength : {
      errorMessage: 'The password must have at least 7 characters',
      options: {min: 6},
    }
  },

  role: {
    optional: {
      options: {nullable: true}
    },
    custom: {
      options: async (role, { req }) => {
        const validRole = await Role.findOne({role});

        if(!validRole){
          throw new Error(`The role ${role} does not exist`);
        } else {
          // req.roleID = validRole.id;
          req.body.roleID = validRole.id;
        }
      }
    }
  }
});

/* Delete User Validations */
export const deleteUserValidations = checkSchema({
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID',
      bail: true
    },
    custom: {
      options: async (id) => {
        const user = await User.findById(id);

        if(!user || user.state == false){
          throw new Error(`The user does not exist in the database`)
        }
      } 
    }
  },

  'authUser.role': {
    custom: {
      options: async (role) => {
        //Esto se puede extraer en un middelware aparte, y pasar el arreglo o crear otra tabla con los
        //roles permitidos, lo cual es un poco mas profesional, por ahora se dejara asi
        const validRoles = ['ADMIN_ROLE', 'WORKER_ROLE'];

        const authUserRole = await Role.findById(role);

        if(!authUserRole || !validRoles.includes(authUserRole.role)){
          throw new Error(`Only the roles: ${validRoles} can delete users, actual role: ${authUserRole?.role}`)
        }
      }
    }
  }
});