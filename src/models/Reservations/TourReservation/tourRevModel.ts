import mongoose from "mongoose";

export interface ITuRev extends Document {
  _id?: string;
  bookingId: string;
  tourId: string;
  name: string;
  tickets: string;
  email?: string;
  phone: string;
  from: Date;
  end: Date;
  createdAt?: Date;
  isApproved: boolean;
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
      type: Number,
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
    vehicleImage: [
      {
        type: String,
      },
    ],
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
