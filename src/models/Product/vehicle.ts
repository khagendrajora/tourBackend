import mongoose from "mongoose";

enum ICondition {
  Good = "Good",
  Bad = "Bad",
}
export interface IVeh extends Document {
  _id?: string;
  businessId: string;
  vehCategory: string;
  vehSubCategory: string;
  services: string[];
  amenities: string[];
  vehCondition: ICondition;
  madeYear: Date;
  vehNumber: string;
  quantity: number;
  capacity: string;
  name: string;
  operationDates: Date[];
  vehImages?: string[];
}

const VehSchema = new mongoose.Schema({
  businessId: {
    type: String,
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
  quantity: {
    type: Number,
    required: true,
  },

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
      type: Date,
      required: true,
    },
  ],

  madeYear: {
    type: Date,
    required: true,
  },
  vehImages: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IVeh>("Vehicle", VehSchema);
