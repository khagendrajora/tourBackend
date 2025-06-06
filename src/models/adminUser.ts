import mongoose from "mongoose";

export interface IAdminUser extends Document {
  _id?: string;
  adminName: string;
  adminEmail: string;
  adminPwd: string;
  isVerified: boolean;
  adminRole: string;
  adminId: string;
  addedBy: string;
}

const adminUserSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    adminPwd: {
      type: String,
      required: true,
    },
    adminRole: {
      type: String,
      default: "ToursewaAdmin",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAdminUser>("AdminUser", adminUserSchema);
