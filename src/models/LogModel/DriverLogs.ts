import mongoose from "mongoose";

export interface IDriverLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  action: string;
  productId: string;
}

const driverLogs = new mongoose.Schema(
  {
    updatedBy: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDriverLogs>("DriverLogs", driverLogs);
