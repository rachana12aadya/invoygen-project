import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    failedLoginCount: { type: Number, default: 0 },
    lockUntil: { type: Date },
    plan: { type: String, enum: ['free', 'paid'], default: 'free' },
    defaults: {
      country: { type: String, default: 'US' },
      currency: { type: String, default: 'USD' },
      font: { type: String, default: 'inter' },
      primaryColor: { type: String, default: '#2E251B' },
      invoicePrefix: { type: String, default: 'INV' },
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
