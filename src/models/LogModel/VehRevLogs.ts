import mongoose from "mongoose";

export interface IVLogs extends Document {
  _id?: string;

  updatedBy: string;
  time: Date;
  status: string;
  bookingId: string;
}

const vehRevLogs = new mongoose.Schema(
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
export default mongoose.model<IVLogs>("VehRevLogs", vehRevLogs);
