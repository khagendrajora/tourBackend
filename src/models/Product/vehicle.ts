import mongoose from "mongoose";
import { FeatureStatus } from "../Featured/Feature";

enum ICondition {
  Good = "Good",
}

export interface IVeh extends Document {
  _id?: string;
  businessId: string;
  businessName: string;
  vehCategory: string;
  isFeatured: FeatureStatus;
  vehSubCategory: string;
  services: string[];
  amenities: string[];
  isActive: boolean;
  vehCondition: ICondition;
  madeYear: Date;
  vehNumber: string;
  baseLocation: string;
  capacity: string;
  name: string;
  operationDates?: string[];
  vehImages?: string[];
  manufacturer: string;
  model: string;
  VIN: string;
  vehicleId: string;
  price?: string;
  description: string;
  addedBy?: string;
  driver?: string;
}

const VehSchema = new mongoose.Schema(
  {
    businessId: {
      type: String,
    },
    driver: {
      type: String,
    },
    price: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: String,
      enum: Object.values(FeatureStatus),
      required: true,
      default: FeatureStatus.No,
    },
    vehicleId: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    baseLocation: {
      type: String,
      required: true,
    },
    vehCategory: {
      type: String,
      required: true,
    },
    vehSubCategory: {
      type: String,
      required: true,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],

    amenities: [
      {
        type: String,
        required: true,
      },
    ],

    capacity: {
      type: String,
      required: true,
    },
    vehCondition: {
      type: String,
      enum: Object.values(ICondition),
      required: true,
    },
    vehNumber: {
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
    manufacturer: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    VIN: {
      type: String,
      required: true,
    },
    madeYear: {
      type: Date,
      required: true,
    },
    vehImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IVeh>("Vehicle", VehSchema);
