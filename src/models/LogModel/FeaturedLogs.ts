import mongoose from "mongoose";

export interface IFeaturedLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  action: string;
  productId: string;
}

const featuredLogs = new mongoose.Schema(
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
export default mongoose.model<IFeaturedLogs>("featuredLogs", featuredLogs);
