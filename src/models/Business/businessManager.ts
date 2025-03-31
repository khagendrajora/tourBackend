import mongoose from "mongoose";
import { BRole } from "./business";

export interface BManager extends Document {
  _id?: string;
  businessId: string;
  email: string;
  password: string;
  role: BRole;
  name: string;
  image: string;
  managerId: string;
}

const ManagerSchema = new mongoose.Schema(
  {
    businessId: {
      type: String,
      ref: "Business",
      required: true,
    },
    image: {
      type: String,
    },
    managerId: {
      type: String,
      required: true,
    },
    name: {
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
    role: {
      type: String,
      enum: ["Admin", "Manager", "Driver", "Sales"],
      default: "Manager",
    },
  },
  { timestamps: true }
);

export default mongoose.model<BManager>("BusinessManager", ManagerSchema);
