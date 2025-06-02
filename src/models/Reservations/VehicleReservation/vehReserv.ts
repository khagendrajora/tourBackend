import mongoose from "mongoose";

export enum IStatus {
  Completed = "Completed",
  Canceled = "Canceled",
  Approved = "Approved",
  Pending = "Pending",
}

export interface IVRev extends Document {
  _id?: string;
  bookingId: string;
  vehicleId: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleName: string;
  bookedBy: string;
  email?: string;
  phone: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  dropOffDate: string;
  address: string;
  bookingName: string;
  status: IStatus;
  businessId: string;
  numberOfPassengers: number;
  totalPrice: string;
  businessName: string;
  businessPhone: string;
  createdAt?: string;
  driver?: string;
  driverPhone?: string;
  driverId?: string;
}

const VehicleReservation = new mongoose.Schema(
  {
    driverPhone: {
      type: String,
    },
    driverId: {
      type: String,
    },
    vehicleId: {
      type: String,
      required: true,
    },
    businessPhone: {
      type: String,
    },
    driver: {
      type: String,
    },
    pickUpDate: {
      type: String,
      required: true,
    },
    dropOffDate: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
    },
    createdAt: {
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
    vehicleType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },

    dropOffLocation: {
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

    status: {
      type: String,
      enum: Object.values(IStatus),
      required: true,
      default: IStatus.Pending,
    },
    businessName: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model<IVRev>("VehicleReservation", VehicleReservation);
