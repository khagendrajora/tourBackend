import mongoose from "mongoose";

export interface ITrekking extends Document {
  _id?: string;
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
  trek_images?: string[];
}

const trekSchema = new mongoose.Schema({
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
  numbers: {
    type: String,
    required: true,
  },
  days: {
    type: String,
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
      // required: true,
    },
  ],

  trek_images: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<ITrekking>("Trekking", trekSchema);
