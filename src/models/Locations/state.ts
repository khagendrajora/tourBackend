import mongoose from "mongoose";

export interface IState extends Document {
  _id?: string;
  state: string;
  // country: string;
}

const stateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    // country: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model<IState>("State", stateSchema);
