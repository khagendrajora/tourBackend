import mongoose from "mongoose";

export interface IToken extends Document {
  _id?: string;
  token: string;
  userId: string;
  createdAt: Date;
}

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 86400,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IToken>("Token", tokenSchema);
