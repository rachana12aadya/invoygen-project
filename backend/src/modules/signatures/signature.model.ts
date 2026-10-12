import { Schema, model, Types } from 'mongoose';

const signatureSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['font', 'drawn'], required: true },
    data: { type: String, required: true, maxlength: 140000 },
  },
  { timestamps: true },
);

export const SavedSignature = model('SavedSignature', signatureSchema);
