import { Schema, model } from 'mongoose';

interface IConfig {
  name: string;
  value: any;
}

const ConfigSchema = new Schema<IConfig>({
  name: { type: String, required: true, index: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const Config = model<IConfig>('Config', ConfigSchema);

export default Config;