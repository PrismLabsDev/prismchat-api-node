import { Schema, model } from 'mongoose';

interface IMessage {
  recipient: string;
  message: string;
}

const MessageSchema = new Schema<IMessage>({
  recipient: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Message = model<IMessage>('Message', MessageSchema);

export default Message;