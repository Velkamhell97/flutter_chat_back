import { model, Schema, Types } from "mongoose";

export interface User {
  name      : string,
  lower     : string,
  email     : string,
  password  : string,
  avatar   ?: string,
  online    : boolean,
  role      : Types.ObjectId,
  google    : boolean,
  state     : boolean,
}

const userSchema = new Schema<User>({
  name     : { type: String, required: [true, 'The name is required'] },
  lower    : String,
  email    : { type: String, required: [true, 'The email is required'], unique: true },
  password : { type: String, required: [true, 'The password is required'] },
  avatar   : String,
  online   : { type: Boolean, default: false },
  role     : { type: Schema.Types.ObjectId, ref: 'Role', required: [true, 'The role is required'] },
  google   : { type: Boolean, default: false },
  state    : { type: Boolean, default: true },
}, 
  { 
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    //->Las fechas por lo general se formatean en el lado del cliente
    timestamps: { createdAt: 'created', updatedAt: 'updated' } 
  }
)

userSchema.pre('save', function(this: User, next) {
  const trim = this.name.split(' ').filter(i => i).join(' ');

  this.name  = trim.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
  this.lower = this.name.toLowerCase();

  next();
})

userSchema.pre('findOneAndUpdate', function( next) {
  //El objeto contiene los datos a actualizar
  let update = this.getUpdate() as User;

  if(!update.name){
    return next();
  }

  const trim = update.name.split(' ').filter(i => i).join(' ');

  update.name  = trim.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
  update.lower = update.name.toLowerCase();

  // this.setUpdate(update); //-Al parecer no es necesario

  next();
})

userSchema.methods.toJSON = function() {
  const { __v, _id, password, ...user  } = this.toObject();
  user.uid = _id;
  return user;
}

userSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'user'
})

const userModel = model<User>('User', userSchema);

export default userModel;
