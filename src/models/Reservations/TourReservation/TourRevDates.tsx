import mongoose from "mongoose";

export interface IRDates extends Document {
  _id?: string;
  tourId: string;
  bookingDate: Date[];
  bookedBy: string;
  bookingId: string;
}

const revDates = new mongoose.Schema(
  {
    tourId: {
      type: String,
      required: true,
    },
    bookingId: {
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
