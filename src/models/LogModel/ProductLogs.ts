import mongoose from "mongoose";

export interface IProductLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  action: string;
  productId: string;
}

const productLogs = new mongoose.Schema(
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
export default mongoose.model<IProductLogs>("productLogs", productLogs);
