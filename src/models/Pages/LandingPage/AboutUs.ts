import mongoose from "mongoose";

export interface IAboutUs extends Document {
  _id?: string;
  startingPrice: string;
  sourceAddress: string;
  destAddress: string;
  vehicle: string;
  travelName: string;
}

const hotDeals = new mongoose.Schema({
  startingPrice: {
    type: String,
  },
  sourceAddress: {
    type: String,
  },
  destAddress: {
    type: String,
  },
  vehicle: {
    type: String,
  },
  travelName: {
    type: String,
  },
});
export default mongoose.model<IAboutUs>("AboutUs", hotDeals);
