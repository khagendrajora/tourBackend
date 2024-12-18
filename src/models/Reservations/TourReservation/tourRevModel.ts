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
  passengerName: string;
  bookedBy: string;
  tickets: number;
  email?: string;
  phone: string;
  date: Date;
  createdAt?: Date;
  isApproved: boolean;
  businessId: string;
  status: IStatus;
}

const TourReservation = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: String,
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
    passengerName: {
      type: String,
      required: true,
    },
    tickets: {
      type: Number,
      required: true,
    },
    email: {
      required: true,
      type: String,
    },
    date: {
      type: Date,
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
