import mongoose from "mongoose";
import { BRole } from "./business";

export enum IStatus {
  Available = "Available",
  Unavailable = "Unavailable",
  Inactive = "Inactive",
}

export interface IDriver extends Document {
  _id?: string;
  driverId: string;
  bookingId?: mongoose.Types.ObjectId[];
  businessId: string;
  businessName: string;
  role: BRole;
  name: string;
  age: number;
  phone: string;
  email: string;
  status: IStatus;
  isActive: boolean;
  isVerified: boolean;
  password: string;
  image: string;
  addedBy: string;
  operationalDate?: string[];
  DOB: string;
}

const driverSchema = new mongoose.Schema(
  {
    DOB: {
      type: String,
      required: true,
    },
    bookingId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleReservation",
      },
    ],
    operationalDate: [
      {
        type: String,
      },
    ],
    addedBy: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
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
      default: IStatus.Inactive,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Driver", "Sales"],
      default: "Driver",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDriver>("Driver", driverSchema);
