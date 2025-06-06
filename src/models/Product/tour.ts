import mongoose from "mongoose";
import { FeatureStatus } from "../Featured/Feature";

export interface ITour extends Document {
  _id?: string;
  tourId: string;
  businessId: string;
  businessName: string;
  pickUpLocation: string;
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
  operationDates: string[];
  tourImages?: string[];
  isFeatured: FeatureStatus;
  price?: string;
  addedBy?: string;
}

const tourSchema = new mongoose.Schema({
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
  tourId: {
    type: String,
    required: true,
  },
  prodCategory: {
    type: String,
  },
  prodsubCategory: {
    type: String,
  },
  inclusion: [
    {
      type: String,
      required: true,
    },
  ],
  dest: {
    type: String,
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
    },
  ],
  isFeatured: {
    type: String,
    enum: Object.values(FeatureStatus),
    required: true,
    default: FeatureStatus.No,
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
