import mongoose from "mongoose";

export interface IDest extends Document {
  dest_image: string;
  title: string;
}

const popularDestSchema = new mongoose.Schema({
  dest_image: {
    type: String,
  },
  title: {
    type: String,
  },
});
export default mongoose.model<IDest>("Destination", popularDestSchema);
