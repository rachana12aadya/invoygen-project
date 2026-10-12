import { Schema, model, Types } from 'mongoose';

export const TOKEN_TYPES = ['email_verify', 'password_reset'] as const;
export type OneTimeTokenType = (typeof TOKEN_TYPES)[number];

const oneTimeTokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: TOKEN_TYPES, required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

oneTimeTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OneTimeToken = model('OneTimeToken', oneTimeTokenSchema);
