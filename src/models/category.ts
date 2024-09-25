import mongoose from "mongoose";

export interface ICategory extends Document {
  _id?: string;
  categoryName: string;
  desc: string;
  subCategory?: string;
}

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
});

export default mongoose.model<ICategory>("Category", categorySchema);
