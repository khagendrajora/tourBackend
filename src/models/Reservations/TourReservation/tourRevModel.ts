import mongoose from "mongoose";

export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  completed = "Completed",
  Pending = "Pending",
}

export interface ITuRev extends Document {
  _id?: string;
  bookingId: string;
  tourId: string;
  tourName: string;
  bookingName: string;
  bookedBy: string;
  numberOfPeople: number;
  email: string;
  phone: string;
  date: string;
  createdAt?: string;
  isApproved: boolean;
  businessId: string;
  status: IStatus;
  totalPrice: string;
  businessName: string;
}

const TourReservation = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: String,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },

    tourId: {
      type: String,
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    bookingName: {
      type: String,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    email: {
      required: true,
      type: String,
    },
    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(IStatus),
      required: true,
      default: IStatus.Pending,
    },
    phone: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model<ITuRev>("TourReservation", TourReservation);
