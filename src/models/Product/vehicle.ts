import mongoose from "mongoose";

enum ICondition {
  Good = "Good",
  Bad = "Bad",
}
export interface IVeh extends Document {
  _id?: string;
  veh_Category: string;
  veh_subCategory: string;
  services: string;
  amenities: string;
  veh_condition: ICondition;
  madeYear: Date;
  veh_number: string;
  quantity: number;
  capacity: string;
  name: string;
  operationDates: Date[];
  veh_images?: string[];
}

const Veh_Schema = new mongoose.Schema({
  veh_Category: {
    type: String,
    required: true,
  },
  veh_subCategory: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    required: true,
  },

  amenities: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  capacity: {
    type: String,
    required: true,
  },
  veh_condition: {
    type: String,
    enum: Object.values(ICondition),
    required: true,
  },
  veh_number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  operationDates: [
    {
      type: String,
      required: true,
    },
  ],

  madeYear: {
    type: Date,
    required: true,
  },
  veh_images: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IVeh>("Vehicle", Veh_Schema);
