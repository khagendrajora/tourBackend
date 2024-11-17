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
  propName: string;
  propCategory: string;
  propSubCategory: string;
  address: IAddress;
  email: string;
  website: string;
  phone: number;
  businessReg: string;
  tax: string;
  contactName: string;
  contactPhone: number;
  dateOfEstab: Date;
  propertyId: string;
}

const propertySchema = new mongoose.Schema(
  {
    propName: {
      type: String,
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    propCategory: {
      type: String,
      required: true,
    },
    propSubCategory: {
      type: String,
      required: true,
    },
    address: {
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
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    businessReg: {
      type: String,
      required: true,
    },
    tax: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: Number,
      required: true,
    },
    dateOfEstab: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProperty>("Property", propertySchema);
