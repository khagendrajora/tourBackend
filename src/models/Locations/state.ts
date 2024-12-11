import mongoose from "mongoose";

export interface IState extends Document {
  _id?: string;
  state: string;
  municipality?: string;
}

const stateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    municipality: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IState>("State", stateSchema);
