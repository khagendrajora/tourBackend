import mongoose from "mongoose";

export enum FeatureStatus {
  Accepted = "Accepted",
  Reject = "Rejected",
  Pending = "Pending",
}
export interface IFeature extends Document {
  _id?: string;
  Id: string;
  name: string;
  businessName: string;
  productId: string;
  status: FeatureStatus;
}

const featureSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FeatureStatus),
      required: true,
      default: FeatureStatus.Pending,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFeature>("Feature", featureSchema);
