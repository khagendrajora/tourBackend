import mongoose from "mongoose";

export interface ITour extends Document {
  _id?: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  dest: string;
  duration: string;
  itinerary: string;
  capacity: string;
  name: string;
  phone: number;
  operationDates: Date[];
  tourImages?: string[];
}

const tourSchema = new mongoose.Schema({
  prodCategory: {
    type: String,

    required: true,
  },
  prodsubCategory: {
    type: String,
    required: true,
  },
  inclusion: {
    type: String,
    required: true,
  },
  dest: {
    type: String,
    required: true,
  },

  duration: {
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
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  operationDates: [
    {
      type: String,
      required: true,
    },
  ],

  tourImages: [
    {
      type: String,
    },
  ],
  capacity: {
    type: String,
  },
});

export default mongoose.model<ITour>("Tour", tourSchema);
