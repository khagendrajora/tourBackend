import mongoose from "mongoose";

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
  driverName: string;
  driverAge: number;
  driverPhone: string;
  driverEmail?: string;
  status: IStatus;
  isActive: boolean;
  isVerified: boolean;
  driverPwd: string;
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
    driverPwd: {
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDriver>("Driver", driverSchema);
