import mongoose from "mongoose";

export interface ITour extends Document {
  _id?: string;
  tourId: string;
  businessId: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  isActive: boolean;
  dest: string;
  duration: string;
  itinerary: string;
  capacity: string;
  name: string;
  phone: number;
  operationDates: Date[];
  tourImages?: string[];
  isFeatured: boolean;
  price?: string;

  addedBy?: string;
}

const tourSchema = new mongoose.Schema({
  businessId: {
    type: String,
  },
  addedBy: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  price: {
    type: String,
  },
  tourId: {
    type: String,
    required: true,
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
    type: Number,
    required: true,
    unique: true,
  },
  operationDates: [
    {
      type: String,
      required: true,
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
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
