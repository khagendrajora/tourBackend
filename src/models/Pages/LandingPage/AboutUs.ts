import mongoose from "mongoose";

export interface IAboutUs extends Document {
  starting_price: string;
  source_dest: string;
  dest: string;
  vehicle: string;
  travel_name: string;
}

const aboutUsSchema = new mongoose.Schema({
  starting_price: {
    type: String,
  },
  source_dest: { type: String },
  dest: { type: String },
  vehicle: { type: String },
  travel_name: { type: String },
});
export default mongoose.model<IAboutUs>("AboutUs", aboutUsSchema);
