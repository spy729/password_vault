import { Schema, model, Document, Types } from 'mongoose';

export interface IVaultItem extends Document {
  userId: Types.ObjectId;
  title: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: Date;
}

const vaultItemSchema = new Schema<IVaultItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const VaultItem = model<IVaultItem>('VaultItem', vaultItemSchema);
export default VaultItem;
