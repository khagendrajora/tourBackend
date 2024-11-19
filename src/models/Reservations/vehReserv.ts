import mongoose from "mongoose";

export enum IStatus {
  Active = "Approved",
  Canceled = "Canceled",
  Fulfilled = "Fulfilled",
  Pending = "Pending",
}

export interface IVRev extends Document {
  _id?: string;
  bookingId: string;
  vehicleId: string;
  vehicleType: string;
  // services?: string;
  // amenities?: string;
  vehicleNumber: string;
  capacity: string;
  vehicleName: string;
  bookedBy: string;
  age: string;
  email?: string;
  phone: string;
  sourceAddress: string;
  destinationAddress: string;
  bookingDate?: Date[];
  address: string;
  bookingName: string;
  status: IStatus;
  businessId: string;
  vehicleImage?: string[];
  numberOfPassengers: number;
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
    // services: {
    //   type: String,
    // },
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
    // amenities: {
    //   type: String,
    // },
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
    bookingDate: [
      {
        type: Date,
      },
    ],
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
