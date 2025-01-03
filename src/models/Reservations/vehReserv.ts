import mongoose from "mongoose";

export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  Fulfilled = "Fulfilled",
  Pending = "Pending",
}

export interface IVRev extends Document {
  _id?: string;
  bookingId: string;
  vehicleId: string;
  vehicleType: string;
  vehicleNumber: string;
  capacity: string;
  vehicleName: string;
  bookedBy: string;
  bookedByName: string;
  age: string;
  email?: string;
  phone: string;
  sourceAddress: string;
  destinationAddress: string;
  startDate?: Date;
  endDate?: Date;
  address: string;
  bookingName: string;
  status: IStatus;
  businessId: string;
  vehicleImage?: string[];
  numberOfPassengers: number;
  time?: string;
  createdAt?: Date;
}

const VehicleReservation = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    time: {
      type: String,
    },
    numberOfPassengers: {
      type: Number,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    bookedByName: {
      required: true,
      type: String,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleImage: [
      {
        type: String,
      },
    ],
    capacity: {
      type: String,
      required: true,
    },

    age: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    sourceAddress: {
      type: String,
      required: true,
    },

    destinationAddress: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
    },

    vehicleName: {
      type: String,
      required: true,
    },
    bookingName: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      rwquired: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: Object.values(IStatus),
      required: true,
      default: IStatus.Pending,
    },
  },

  { timestamps: true }
);

export default mongoose.model<IVRev>("VehicleReservation", VehicleReservation);
