import mongoose from "mongoose";

export interface ILocation extends Document {
  _id?: string;
  country: string;
  state: string;
  municipality: string;
  locationName: string;
  fullLocation: string;
}

const locationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    municipality: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    fullLocation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILocation>("Location", locationSchema);
