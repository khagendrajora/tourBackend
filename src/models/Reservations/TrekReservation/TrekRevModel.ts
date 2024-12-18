import mongoose from "mongoose";

export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  completed = "Completed",
  Pending = "Pending",
}

export interface ITrRev extends Document {
  _id?: string;
  bookingId: string;
  trekId: string;
  trekName: string;
  passengerName: string;
  businessId: string;
  tickets: number;
  bookedBy: string;
  email?: string;
  phone: string;
  date: Date;
  createdAt?: Date;
  isApproved: boolean;
  status: IStatus;
}

const TrekReservation = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },

    businessId: {
      type: String,
      required: true,
    },
    trekId: {
      type: String,
      required: true,
    },
    trekName: {
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

    // end: {
    //   type: String,
    //   required: true,
    // },
    phone: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(IStatus),
      required: true,
      default: IStatus.Pending,
    },
    bookedBy: {
      type: String,
    },
  },

  { timestamps: true }
);

export default mongoose.model<ITrRev>("TrekReservation", TrekReservation);
