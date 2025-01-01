import mongoose from "mongoose";

export interface IFeature extends Document {
  _id?: string;
  Id: string;
  name: string;
  businessName: string;
}

const featureSchema = new mongoose.Schema(
  {
    Id: {
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
  },
  { timestamps: true }
);

export default mongoose.model<IFeature>("Feature", featureSchema);
