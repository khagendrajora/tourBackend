import mongoose from "mongoose";

export interface IMunicipality extends Document {
  _id?: string;
  municipality: string;
  // locations?: string;
}

const municipalitySchema = new mongoose.Schema(
  {
    municipality: {
      type: String,
      required: true,
    },
    // locations: [
    //   {
    //     type: String,
    //   },
    // ],
  },
  { timestamps: true }
);

export default mongoose.model<IMunicipality>(
  "Municipality",
  municipalitySchema
);
