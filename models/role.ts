import { model, Schema } from "mongoose";

export interface Role {
  name: string
}

const roleSchema = new Schema<Role>({
  name: { type: String, required: [true, 'El rol es obligatorio'] }
})

roleSchema.pre('save', function(this: Role, next) {
  const trim = this.name.split(' ').filter(i => i).join(' ');
  this.name  = trim.toUpperCase();
  next();
})

roleSchema.methods.toJSON = function() {
  const { __v, ...role  } = this.toObject();
  return role;
}

const roleModel = model<Role>('Role', roleSchema);

export default roleModel;