import { model, Schema, Types } from "mongoose";

interface User {
  name     : string,
  email    : string,
  password : string,
  avatar  ?: string,
  state    : boolean,
  online   : boolean,
  role     : Types.ObjectId
}

const userSchema = new Schema<User>({
  name     : { type: String, required: [true, 'The name is required'] },
  email    : { type: String, required: [true, 'The email is required'], unique: true },
  password : { type: String, required: [true, 'The password is required'] },
  avatar   : { type: String },
  state    : { type: Boolean, default: true },
  online   : { type: Boolean, default: false },
  role     : { type: Schema.Types.ObjectId, ref: 'Role', required: true }
})

userSchema.methods.toJSON = function() {
  const { __v, _id, password, ...user  } = this.toObject();
  user.uid = _id;
  return user;
}

const userModel = model<User>('User', userSchema);

//-Lo que devuelve al hacer un require o import
export default userModel;
