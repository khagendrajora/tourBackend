import mongoose from "mongoose";

export interface IFooter extends Document {
  _id?: string;
  facebook: string;
  twiter: string;
  whatapp: string;
  youtube: string;
  instagram: string;
}

const footerSchema = new mongoose.Schema({
  facebook: {
    type: String,
  },
  twiter: {
    type: String,
  },
  whatapp: {
    type: String,
  },
  youtube: {
    type: String,
  },
  instagram: {
    type: String,
  },
});
export default mongoose.model<IFooter>("Footer", footerSchema);
