import { Schema } from 'mongoose';

export const RefreshTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User id can not be empty'],
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
  }
);

RefreshTokenSchema.index({ userId: 1 });
