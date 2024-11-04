import mongoose from "mongoose";

export interface IBusiness extends Document {
  _id?: string;
  businessName: string;
  businessCategory: string;
  taxRegistration: string;
  businessAddress: string;
  primaryEmail: string;
  primaryPhone: string;
  isActive: boolean;
  businessPwd: string;
  isVerified: boolean;
}

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessCategory: {
    type: String,
    required: true,
  },
  taxRegistration: {
    type: String,
    required: true,
    unique: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  primaryEmail: {
    type: String,
    required: true,
    unique: true,
  },
  primaryPhone: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  businessPwd: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IBusiness>("Business", businessSchema);
