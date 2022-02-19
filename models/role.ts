import { model, Schema } from "mongoose";

export interface Role {
  role: string
}

const roleSchema = new Schema<Role>({
  role: { type: String, required: [true, 'El rol es obligatorio'] }
})

roleSchema.methods.toJSON = function() {
  const { __v, ...role  } = this.toObject();
  return role;
}

const roleModel = model<Role>('Role', roleSchema);

export default roleModel;