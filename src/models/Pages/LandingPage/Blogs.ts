import mongoose from "mongoose";

export interface IBlogs extends Document {
  blogs_image: string[];
  title: string;
  desc: string;
}

const blogsSchema = new mongoose.Schema({
  blogs_image: [
    {
      type: String,
    },
  ],
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
});
export default mongoose.model<IBlogs>("Blogs", blogsSchema);
