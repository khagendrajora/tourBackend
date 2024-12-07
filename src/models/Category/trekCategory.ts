import mongoose from "mongoose";

export interface TrekCategory extends Document {
  _id?: string;
  categoryName: string;
  desc?: string;
  subCategory?: string[];
  categoryId: string;
}

const trekCategory = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    subCategory: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<TrekCategory>("TrekCategory", trekCategory);
