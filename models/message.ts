import { model, Schema, Types } from "mongoose";

export interface Message {
  from : Types.ObjectId,
  to : Types.ObjectId,
  text ?: string,
  time : string,
  image ?: string,
  audio ?: string,
  tempUrl ?: string,
  read : boolean
}

const messageSchema = new Schema<Message>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  time: { type: String, required: true },
  image: String,
  audio: String,
  tempUrl: String,
  read: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

messageSchema.methods.toJSON = function() {
  const { __v, ...message  } = this.toObject();
  return message;
}

const messageModel = model<Message>('Message', messageSchema);

export default messageModel;