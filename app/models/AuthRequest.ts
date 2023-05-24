import { Schema, model } from 'mongoose';

interface IAuthRequest {
  publicKey: string;
  verificationString: string;
}

const AuthRequestSchema = new Schema<IAuthRequest>({
  publicKey: { type: String, required: true },
  verificationString: { type: String, required: true },
}, { timestamps: true });

const AuthRequest = model<IAuthRequest>('AuthRequest', AuthRequestSchema);

export default AuthRequest;