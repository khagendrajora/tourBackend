import mongoose from "mongoose";

export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  // image?: string;
  userId: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // userImage: {
    //   type: String,
    // },
    role: {
      type: String,
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
