import mongoose from "mongoose";

interface ISocialMedia {
  platform: string;
  url: string;
}

interface IBusinessRegistration {
  authority?: string;
  registrationNumber: string;
  registrationOn?: Date;
  expiresOn?: Date;
}

export interface IBusiness extends Document {
  _id?: string;
  businessName: string;
  businessCategory: string;
  businessSubCategory?: string;

  businessAddress: {
    street: string;
    country?: string;
    state?: string;
    city?: string;
  };
  primaryEmail: string;
  primaryPhone: string;
  isActive: boolean;
  businessPwd: string;
  businessRole: string;
  isVerified: boolean;
  bId: string;
  website?: string;
  contactName?: string;
  businessRegistration?: IBusinessRegistration;
  socialMedia?: ISocialMedia;
  imageGallery?: string[];
  profileIcon?: string;
}

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    bId: {
      type: String,
      required: true,
    },
    businessCategory: {
      type: String,
      required: true,
    },
    businessSubCategory: {
      type: String,
    },
    businessRegistration: {
      authority: {
        type: String,
      },
      registrationNumber: {
        type: String,
        required: true,
      },
      registrationOn: {
        type: Date,
      },
      expiresOn: {
        type: Date,
      },
    },
    businessAddress: {
      street: {
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
    primaryEmail: {
      type: String,
      required: true,
      unique: true,
    },
    primaryPhone: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    businessPwd: {
      type: String,
      required: true,
    },
    businessRole: {
      type: String,
      default: "1",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
    },
    contactName: {
      type: String,
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

export default mongoose.model<IBusiness>("Business", businessSchema);
