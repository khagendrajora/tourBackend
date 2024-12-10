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
  name: string;
  tickets: string;
  email?: string;
  phone: string;
  from: Date;
  // end: Date;
  createdAt?: Date;
  isApproved: boolean;
  status: IStatus;
}

const TourReservation = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    tourId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tickets: {
      type: String,
      required: true,
    },
    email: {
      required: true,
      type: String,
    },
    from: {
      type: String,
      required: true,
    },

    end: {
      type: String,
      required: true,
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
