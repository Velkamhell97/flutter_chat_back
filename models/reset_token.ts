import { model, Schema } from "mongoose";

export interface Token {
  token: string,
  email: string,
  expires_at: Date
}

const tokenSchema = new Schema<Token>({
  token: { type: String, required: [true, 'Thr token is required'] },
  email: { type: String, required: [true, 'Thr email is required'] },
  //-Elimina el documento pasado el tiempo (en segundos)
  expires_at: { type: Date, default: Date.now, expires: 600 },
})

tokenSchema.methods.toJSON = function() {
  const { __v, ...token  } = this.toObject();
  return token;
}

const tokenModel = model<Token>('Token', tokenSchema);

export default tokenModel;