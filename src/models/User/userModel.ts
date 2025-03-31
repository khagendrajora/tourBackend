import mongoose from "mongoose";

export interface IUser extends Document {
  _id?: string;
  userName: string;
  userEmail: string;
  password: string;
  userRole: string;
  isVerified: boolean;
  // userImage?: string;
  userId: string;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
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
    userRole: {
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
