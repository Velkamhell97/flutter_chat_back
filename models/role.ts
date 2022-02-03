import { model, Schema } from "mongoose";

interface Role {
  role: string
}

const roleSchema = new Schema<Role>({
  role: { type: String, required: [true, 'El rol es obligatorio'] }
})

const roleModel = model<Role>('Role', roleSchema);

export default roleModel;