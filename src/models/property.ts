import mongoose from "mongoose";

interface IAddress {
  country: string;
  state: string;
  district: string;
  municipality: string;
  street: string;
  subrub: string;
  postcode: string;
}

export interface IProperty extends Document {
  _id?: string;
  PropName: string;
  PropCategory: string;
  PropSubCategory: string;
  Address: IAddress;
  Email: string;
  Website: string;
  Phone: number;
  BusinessReg: string;
  Tax: string;
  ContactName: string;
  ContactPhone: number;
  DateOfEstab: Date;
}

const propertySchema = new mongoose.Schema({
  PropName: {
    type: String,
    required: true,
  },
  PropCategory: {
    type: String,
    required: true,
  },
  PropSubCategory: {
    type: String,
    required: true,
  },
  Address: {
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    municipality: {
      type: String,
    },
    street: {
      type: String,
    },
    subrub: {
      type: String,
    },
    postcode: {
      type: String,
    },
  },
  Email: {
    type: String,
    required: true,
  },
  Website: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    required: true,
  },
  BusinessReg: {
    type: String,
    required: true,
  },
  Tax: {
    type: String,
    required: true,
  },
  ContactName: {
    type: String,
    required: true,
  },
  ContactPhone: {
    type: Number,
    required: true,
  },
  DateOfEstab: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<IProperty>("Property", propertySchema);
