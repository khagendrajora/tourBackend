import mongoose from "mongoose";

export interface ITrekking extends Document {
  _id?: string;
  businessId: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  days: number;
  dest: string;
  numbers: number;
  itinerary: string;
  capacity: string;
  name: string;
  operationDates?: Date[];
  trekImages?: string[];
}

const trekSchema = new mongoose.Schema({
  businessId: {
    type: String,
  },
  prodCategory: {
    type: String,

    required: true,
  },
  prodsubCategory: {
    type: String,
    required: true,
  },
  inclusion: [
    {
      type: String,
      required: true,
    },
  ],
  dest: {
    type: String,
    required: true,
  },
  numbers: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },

  capacity: {
    type: String,
    required: true,
  },
  itinerary: {
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
    },
  ],

  trekImages: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<ITrekking>("Trekking", trekSchema);
