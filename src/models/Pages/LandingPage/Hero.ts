import mongoose from "mongoose";

export interface IHero extends Document {
  _id?: string;
  heroImage?: string[];
}

const heroSchema = new mongoose.Schema({
  heroImage: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IHero>("Hero", heroSchema);
