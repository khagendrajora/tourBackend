import mongoose from "mongoose";

export interface VCategory extends Document {
  _id?: string;
  categoryName: string;
  desc?: string;
  subCategory?: string[];
  categoryId: string;
}

const vehicleCategory = new mongoose.Schema(
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

export default mongoose.model<VCategory>("VehileCategory", vehicleCategory);
