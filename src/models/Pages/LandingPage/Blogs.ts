import mongoose from "mongoose";

export interface IBlogs extends Document {
  _id?: string;
  blogsImage?: string[];
  title: string;
  desc: string;
}

const blogsSchema = new mongoose.Schema({
  blogsImage: [
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
