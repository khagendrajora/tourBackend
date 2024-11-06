import mongoose from "mongoose";

export interface IRDates extends Document {
  _id?: string;
  vehId: string;
  bookingDate: Date[];
}

const revDates = new mongoose.Schema(
  {
    vehId: {
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
export default mongoose.model<IRDates>("RevDate", revDates);
