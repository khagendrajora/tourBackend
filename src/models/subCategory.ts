import mongoose from "mongoose";

export interface ISubCategory extends Document {
  categoryName: string;
  subCategoryName: string;
  desc?: string;
  categoryId: string;
  _id?: string;
}

const subCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  subCategoryName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
});

export default mongoose.model<ISubCategory>("SubCategory", subCategorySchema);
