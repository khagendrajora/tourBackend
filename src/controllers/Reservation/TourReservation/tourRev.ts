import TourReservation from "../../../models/Reservations/TourReservation/tourRevModel";
import { Request, Response } from "express";
import { sendEmail } from "../../../utils/setEmail";
const { customAlphabet } = require("nanoid");
import Tour from "../../../models/Product/tour";

export const tourRev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "TR" + bookingId;

  const { name, tickets, email, phone, from, end } = req.body;

  try {
    const tourData = await Tour.findOne({ tourId: id });
    if (!tourData) {
      return res.status(401).json({ error: "Tour Unavailable" });
    }
    // const businessdata = await Business.findOne({ bId: vehData.businessId });

    let tourRev = new TourReservation({
      name,
      tickets,
      email,
      phone,
      from,
      end,
      bookingId: bookingId,
      tourId: id,
    });
    tourRev = await tourRev.save();
    if (!tourRev) {
      return res.status(400).json({ error: "Booking failed" });
    }
    //  else {
    //   let resrvDate = new ReservedDate({
    //     vehicleId: id,
    //     bookingDate,
    //     bookedBy,
    //     bookingId: bookingId,
    //   });
    //   resrvDate = await resrvDate.save();
    //   if (!resrvDate) {
    //     return res.status(400).json({ error: "failed to save date" });
    //   } else {
    //     await Vehicle.findOneAndUpdate(
    //       { vehId: id },
    //       {
    //         operationDates: bookingDate,
    //       },
    //       { new: true }
    //     );

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Confirmation",
      html: `<h2>Your booking has been successfully Created with Booking Id ${bookingId} </h2>`,
    });
    // sendEmail({
    //   from: "beta.toursewa@gmail.com",
    //   to: businessdata?.primaryEmail,
    //   subject: "New Booking",
    //   html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
    // });
    return res.status(200).json({ message: "Successfully Send" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
