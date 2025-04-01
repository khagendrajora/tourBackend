import mongoose from "mongoose";
import { BRole } from "./business";

export enum IStatus {
  Available = "Available",
  Unavailable = "Unavailable",
  Leave = "Leave",
  Occupied = "Occupied",
}

export interface IDriver extends Document {
  _id?: string;
  driverId: string;
  vehicleId: string;
  vehicleName: string;
  businessId: string;
  role: BRole;
  name: string;
  age: number;
  phone: string;
  email?: string;
  status: IStatus;
  isActive: boolean;
  isVerified: boolean;
  password: string;
  image: string;
  addedBy: string;
}

const driverSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    businessId: {
      type: String,
      ref: "Business",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(IStatus),
      default: IStatus.Available,
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDriver>("Driver", driverSchema);
