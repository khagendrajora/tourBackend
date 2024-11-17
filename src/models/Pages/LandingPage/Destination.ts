import mongoose from "mongoose";

export interface IDest extends Document {
  _id?: string;
  destImage: string[];
  title: string;
  destId: string;
}

const popularDestSchema = new mongoose.Schema({
  destImage: [
    {
      type: String,
    },
  ],
  destId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
});
export default mongoose.model<IDest>("Destination", popularDestSchema);
