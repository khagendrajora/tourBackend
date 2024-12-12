import mongoose from "mongoose";

export interface ITourLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  status: string;
  bookingId: string;
}

const tourRevLogs = new mongoose.Schema(
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
export default mongoose.model<ITourLogs>("TourRevLogs", tourRevLogs);
