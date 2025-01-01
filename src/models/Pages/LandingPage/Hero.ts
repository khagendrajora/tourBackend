import mongoose from "mongoose";

export interface IHero extends Document {
  _id?: string;
  heroImage?: string[];
  heading: string;
  description: string;
}

const heroSchema = new mongoose.Schema({
  heroImage: [
    {
      type: String,
    },
  ],
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
});

export default mongoose.model<IHero>("Hero", heroSchema);
