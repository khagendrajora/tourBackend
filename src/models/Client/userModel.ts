import mongoose from "mongoose";

export interface IUser extends Document {
  _id?: string;
  userName: string;
  userEmail: string;
  userPwd: string;
  userRole: string;
  isVerified: boolean;
  userImage?: string;
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
    userPwd: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
    },
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

export default mongoose.model<IUser>("ClientUser", userSchema);
