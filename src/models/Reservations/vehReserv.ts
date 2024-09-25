import mongoose from "mongoose";

export interface IVRev extends Document {
  _id?: string;
  veh_id: string;
  veh_type: string;
  services: string;
  amenities: string;
  veh_number: string;
  capacity: string;
  veh_name: string;
  passenger_name: string;
  age: string;
  email?: string;
  phone: string;
  sourceAdd: string;
  destAdd: string;
  bookingDate?: Date[];
  address: string;
}

const Veh_Rev = new mongoose.Schema({
  veh_id: {
    type: String,
    required: true,
  },
  veh_type: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  sourceAdd: {
    type: String,
    required: true,
  },

  destAdd: {
    type: String,
    required: true,
  },
  amenities: {
    type: String,
    required: true,
  },
  veh_number: {
    type: String,
    required: true,
  },

  veh_name: {
    type: String,
    required: true,
  },
  passenger_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bookingDate: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IVRev>("VehRev", Veh_Rev);
