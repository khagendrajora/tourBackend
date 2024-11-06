import mongoose from "mongoose";

export interface IVRev extends Document {
  _id?: string;
  vehId: string;
  vehType: string;
  services: string;
  amenities: string;
  vehNumber: string;
  capacity: string;
  vehName: string;
  passengerName: string;
  age: string;
  email?: string;
  phone: string;
  sourceAddress: string;
  destAddress: string;
  bookingDate?: Date[];
  address: string;
}

const VehRev = new mongoose.Schema({
  vehId: {
    type: String,
    required: true,
  },
  vehType: {
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
  sourceAddress: {
    type: String,
    required: true,
  },

  destAddress: {
    type: String,
    required: true,
  },
  amenities: {
    type: String,
    required: true,
  },
  vehNumber: {
    type: String,
    required: true,
  },

  vehName: {
    type: String,
    required: true,
  },
  passengerName: {
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

export default mongoose.model<IVRev>("VehRev", VehRev);
