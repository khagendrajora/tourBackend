import mongoose from "mongoose";

export interface IHero extends Document {
  hero_image?: string;
}

const heroSchema = new mongoose.Schema({
  hero_image: {
    type: String,
  },
});

export default mongoose.model<IHero>("Hero", heroSchema);
