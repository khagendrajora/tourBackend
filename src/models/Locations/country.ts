import mongoose from "mongoose";

export interface ICountry extends Document {
  _id?: string;
  country: string;
  // state?: string[];
}

const countrySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICountry>("Country", countrySchema);
