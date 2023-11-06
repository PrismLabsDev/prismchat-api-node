import { Schema, model } from 'mongoose';

interface IPushSubscription {
  publicKey: string;
  endpoint: string
  expirationTime: Number,
  keys: {
    p256dh: string,
    auth: string,
  }
}

const PushSubscriptionSchema = new Schema<IPushSubscription>({
  publicKey: { type: String, required: true, index: true },
  endpoint: { type: String, required: true },
  expirationTime: { type: Number, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  }
}, { timestamps: true });

const PushSubscription = model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);

export default PushSubscription;