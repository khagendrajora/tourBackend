import mongoose from "mongoose";

export enum BRole {
  Admin = "Admin",
  Manager = "Manager",
  Driver = "Driver",
  Sales = "Sales",
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
  password: string;
  role: BRole;
  isVerified: boolean;
  businessId: string;
  website?: string;
  contactName?: string;
  businessRegistration?: IBusinessRegistration;
  socialMedia?: [
    {
      platform: string;
      url: string;
    }
  ];
  imageGallery?: string[];
  profileIcon?: string;
  addedBy: string;
}

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    businessId: {
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Driver", "Sales"],
      default: "Admin",
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

    socialMedia: [
      {
        platform: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
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
