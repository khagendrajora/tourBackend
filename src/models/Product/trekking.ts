import mongoose from "mongoose";
import { FeatureStatus } from "../Featured/Feature";

export interface ITrekking extends Document {
  _id?: string;
  businessId: string;
  businessName: string;
  pickUpLocation: string;
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
  operationDates?: string[];
  trekImages?: string[];
  trekId: string;
  isFeatured: FeatureStatus;
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
  pickUpLocation: {
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
    type: String,
    enum: Object.values(FeatureStatus),
    required: true,
    default: FeatureStatus.No,
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
