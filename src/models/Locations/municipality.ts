import mongoose from "mongoose";

export interface IMunicipality extends Document {
  _id?: string;
  municipality: string;
  district: string;
  // country: string;
  state: string;
  // locations?: string;
}

const municipalitySchema = new mongoose.Schema(
  {
    municipality: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
    // country: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model<IMunicipality>(
  "Municipality",
  municipalitySchema
);
