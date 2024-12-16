import mongoose from "mongoose";

export interface IDistrict extends Document {
  _id?: string;
  state: string;
  district: string;
}

const districtSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDistrict>("District", districtSchema);
