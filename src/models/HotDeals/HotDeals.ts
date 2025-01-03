import mongoose from "mongoose";

export enum IHotDealStatus {
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface IHotDeal extends Document {
  _id?: string;
  driverId: string;
  vehicleId: string;
  vehicleName: string;
  businessName: string;
  businessId: string;
  driverName: string;
  driverPhone: string;
  status: IHotDealStatus;
  price: number;
  date: Date;
  sourceAddress: string;
  destAddress: string;
  hdID: string;
  capacity: string;
  time: string;
  termsAndCondition?: string;
}

const hotDealsSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    termsAndCondition: {
      type: String,
      // required: true,
    },
    time: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    sourceAddress: {
      type: String,
      required: true,
    },
    destAddress: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    hdID: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },

    driverId: {
      type: String,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(IHotDealStatus),
      default: IHotDealStatus.Available,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IHotDeal>("HotDeals", hotDealsSchema);
