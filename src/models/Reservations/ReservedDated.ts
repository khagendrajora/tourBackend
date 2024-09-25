import mongoose from "mongoose";

export interface IRDates extends Document {
  _id?: string;
  veh_id: string;
  bookingDate: Date[];
}

const rev_dates = new mongoose.Schema({
  veh_id: {
    type: String,
    required: true,
  },

  bookingDate: [
    {
      type: String,
    },
  ],
});
export default mongoose.model<IRDates>("RevDate", rev_dates);
