import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
    toJSON: {
      versionKey: false,
    },
  },
);

// Email must be unique
UserSchema.index({ email: 1 }, { unique: true });
