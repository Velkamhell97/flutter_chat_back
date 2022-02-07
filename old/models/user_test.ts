import { model, Schema, Types } from "mongoose";


interface User {
  name       : string,
  name_lower : string,
  email      : string,
  password   : string,
  avatar    ?: string,
  state      : boolean,
  online     : boolean,
  role       : Types.ObjectId,
  google     : boolean,

  // books      : BookInterface[]
  // names      : string[]
  // comments      : string[]
  // social     : Map<string, string>
}

const userSchema = new Schema<User>({
  name       : { 
    type: String, 
    required: [true, 'The name is required'],
    //-Validaciones personalizadas a los capos, si arroja false no guarda el registro
    // validate: {
    //   validator: (v:string) => {},
    //   message: 'error'
    // }
},
  name_lower : { type: String },
  email      : { type: String, required: [true, 'The email is required'], unique: true },
  password   : { type: String, required: [true, 'The password is required'] },
  avatar     : { type: String },
  state      : { type: Boolean, default: true },
  online     : { type: Boolean, default: false },
  role       : { type: Schema.Types.ObjectId, ref: 'Role', required: [true, 'The role is required'] },
  google     : { type: Boolean, default: false },


  //-Se permiten guardar arreglos de otros esquemas o de tipos primitivos
  // books : [BooksSchema],
  // names : [String]
  // comments : [ {type: String} ] //un arreglo y cada elemento unas propiedades
  //-Tambien objetos tipo js, y estos pueden ser de tipo de otros esquemas
  // social: { type: Map, of: String, of: BookSchema }

  //-Pueden agregarse sub esquemas (algo similar a las relaciones)
  // subSchema: { type: subSchema  }
}, 
  //-Para agregar marcas de tiempo a los usuarios modificados y creados, se pude crear un virtual que devuelva
  //-una hora formateada, estos timestapm tambien se podrian manejar mannualmente, en formato string
  { timestamps: { 
    createdAt: 'created_at', updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  } }
  // { collation: { locale: 'en_US', strength: 1 } }
)

//-Un virtual es un metodo virtual que tenemos disponible unicamente en el objeto devuelvto por un query
//-no esta en la base de datos como una propiedad, solo un metodo helper de algun modelo
//-generalmente son setters, pero tambien pueden configurarse como setters, para modificar elementos
//-del modelo, aqui es un ejemplo imaginario si se quisiera devolver el nombre completo solo visualmente
//-tambien se podria establecer ese valor y separarlo e asignarlo a cada propiedad
userSchema.virtual('fullName').
  get(function(this:User) {
    return this.name + ' ' + this.email;
    }).
  set(function(this: User , v : string) {
    this.name  = v.substring(0, v.indexOf(' '));
    this.email = v.substring(v.indexOf(' ') + 1);
});

//-El metodo pre y post se utilizan para ejecutar ciertas operaciones en los elementos del modelo
//-antes o despues de una accion en especifica, muy util para sanitizar o aplicar transformaciones a los modelos
//-antes que estos sean almacenados, la ventaja de esto frente a los setters y getters o virtual methods, esque
//-se definen una unica vez y no se tendran que volver a ejecutar con cada query, claro esta que esto depende
//-de las especificaciones del proyecto
userSchema.pre('save', function(this: User, next) {
  const parts = this.name.split(' ').filter(i => i);

  const capitalize = parts.reduce((p,c) => p.replace(p[0], p[0].toUpperCase()) + ' ' + c.replace(c[0], c[0].toUpperCase()))

  this.name = capitalize;
  this.name_lower = this.name.toLowerCase();

  next();
})

userSchema.methods.toJSON = function() {
  const { __v, _id, password, ...user  } = this.toObject();
  user.uid = _id;
  return user;
}

const userModel = model<User>('User', userSchema);

//Se pueden programar eventos para cambios en la data que deberia hacerlo los sockets
// userModel.watch().on('change', data => {});

//-Lo que devuelve al hacer un require o import
export default userModel;
