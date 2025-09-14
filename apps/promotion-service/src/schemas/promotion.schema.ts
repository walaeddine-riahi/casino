import { Schema } from 'mongoose';

export const PromotionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
    },
    isActive: {
      type: Boolean,
      required: [true, 'isActive is required'],
    },
    userId: {
      type: String,
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

PromotionSchema.index({ userId: 1 });
