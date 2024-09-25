import mongoose from "mongoose";

export interface IBusiness extends Document {
  _id?: string;
  businessName: string;
  businessCategory: string;
  taxRegistration: string;
  address: string;
  primaryEmail: string;
  primaryPhone: string;
  isActive: boolean;
  password: string;
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
  address: {
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
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IBusiness>("Business", businessSchema);
