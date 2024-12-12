import mongoose from "mongoose";

export interface ITrekLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  status: string;
  bookingId: string;
}

const trekRevLogs = new mongoose.Schema(
  {
    updatedBy: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
    },
  },
  { timestamps: true }
);
export default mongoose.model<ITrekLogs>("TrekRevLogs", trekRevLogs);
