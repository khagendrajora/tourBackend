import mongoose from "mongoose";

export interface IHero extends Document {
  _id?: string;
  hero_image?: string[];
}

const heroSchema = new mongoose.Schema({
  hero_image: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IHero>("Hero", heroSchema);
