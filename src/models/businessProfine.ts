import mongoose, { Schema } from "mongoose";

interface ISocialMedia {
  platform: string;
  url: string;
}

interface IBusinessRegistration {
  authority: string;
  registrationNumber: string;
  registrationOn: Date;
  expiresOn: Date;
}

export interface iBusinessProfile extends Document {
  _id?: string;
  businessId: mongoose.Types.ObjectId;
  businessName: string;
  businessCategory?: string;
  businessSubcategory: string;
  businessAddress: {
    address: string;
    country: string;
    state: string;
    city: string;
  };
  email: string;
  website: string;
  contactName: string;
  phone: string;
  businessRegistration: IBusinessRegistration;
  socialMedia?: ISocialMedia;
  imageGallery?: string[];
  profileIcon?: string;
}

const businessProfileSchema = new mongoose.Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessCategory: {
      type: String,
      required: true,
    },
    businessSubcategory: {
      type: String,
    },
    businessAddress: {
      address: {
        type: String,
      },
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    businessRegistration: {
      authority: {
        type: String,
        required: true,
      },
      registrationNumber: {
        type: String,
        required: true,
        unique: true,
      },
      registrationOn: {
        type: Date,
        required: true,
      },
      expiresOn: {
        type: Date,
        required: true,
      },
    },
    socialMedia: {
      platform: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    imageGallery: [
      {
        type: String,
      },
    ],
    profileIcon: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iBusinessProfile>(
  "BusinessProfile",
  businessProfileSchema
);
