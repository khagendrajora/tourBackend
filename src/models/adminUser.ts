import mongoose from "mongoose";

interface IAdminUser extends Document {
  _id?: string;
  adminName: string;
  Email: string;
  Pwd: string;
  cPwd: string;
  Role: boolean;
}

const adminUserSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Pwd: {
    type: String,
    required: true,
  },
  cPwd: {
    type: String,
    required: true,
  },
  Role: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<IAdminUser>("AdminUser", adminUserSchema);
