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
  driverName: string;
  driverAge: number;
  driverPhone: string;
  driverEmail?: string;
  status: IStatus;
  isActive: boolean;
  isVerified: boolean;
  password: string;
  driverImage: string;
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
    driverEmail: {
      type: String,
    },
    businessId: {
      type: String,
      ref: "Business",
      required: true,
    },
    driverAge: {
      type: Number,
      required: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(IStatus),
      default: IStatus.Available,
      required: true,
    },
    driverImage: {
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
