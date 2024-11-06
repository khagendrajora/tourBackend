import mongoose from "mongoose";

export interface IUser extends Document {
  _id?: string;
  userName: string;
  userEmail: string;
  pwd: string;
  userRole: string;
  isVerified: boolean;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },

    userRole: {
      type: Boolean,
      default: "0",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
