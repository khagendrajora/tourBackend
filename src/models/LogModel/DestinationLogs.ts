import mongoose from "mongoose";

export interface IDestLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  action: string;
  productId: string;
}

const destLogs = new mongoose.Schema(
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
export default mongoose.model<IDestLogs>("DestLogs", destLogs);
