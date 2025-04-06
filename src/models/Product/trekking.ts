import mongoose from "mongoose";

export interface ITrekking extends Document {
  _id?: string;
  businessId: string;
  businessName: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  days: number;
  dest: string;
  numbers: number;
  itinerary: string;
  isActive: boolean;
  capacity: string;
  name: string;
  operationDates?: Date[];
  trekImages?: string[];
  trekId: string;
  isFeatured: boolean;
  price?: string;
  addedBy?: string;
}

const trekSchema = new mongoose.Schema({
  businessId: {
    type: String,
  },
  businessName: {
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
  isFeatured: {
    type: Boolean,
    default: false,
  },
  trekId: {
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
      type: Date,
    },
  ],

  trekImages: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<ITrekking>("Trekking", trekSchema);
