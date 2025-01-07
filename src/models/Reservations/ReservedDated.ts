import mongoose from "mongoose";

export interface IRDates extends Document {
  _id?: string;
  vehicleId: string;
  bookingDate: Date[];
  bookedBy: string;
  bookingId: string;
  time?: string;
  startTime: string;
}

const revDates = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: String,
      required: true,
    },

    bookingDate: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model<IRDates>("ReservedDate", revDates);
