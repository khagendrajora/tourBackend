import mongoose from "mongoose";

export interface IRDates extends Document {
  _id?: string;
  vehicleId: string;
  bookingDate: Date[];
  bookedBy: string;
}

const revDates = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: String,
      required: true,
    },

    bookingDate: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model<IRDates>("ReservedDate", revDates);
