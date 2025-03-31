import mongoose from "mongoose";
import { BRole } from "./business";

export interface BSales extends Document {
  _id?: string;
  businessId: string;
  email: string;
  password: string;
  role: BRole;
  name: string;
  image: string;
}

const SalesSchema = new mongoose.Schema(
  {
    businessId: {
      type: String,
      ref: "Business",
      required: true,
    },
    salesId: {
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
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Driver", "Sales"],
      default: "Sales",
    },
  },
  { timestamps: true }
);

export default mongoose.model<BSales>("BusinessSales", SalesSchema);
