import TrekReservation from "../../../models/Reservations/TrekReservation/TrekRevModel";
import { Request, Response } from "express";
import { sendEmail } from "../../../utils/setEmail";
const { customAlphabet } = require("nanoid");
import Trekking from "../../../models/Product/trekking";

export const trekRev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "TrR" + bookingId;

  const { passengerName, tickets, email, phone, from } = req.body;
  try {
    const trekData = await Trekking.findOne({ trekId: id });
    if (!trekData) {
      return res.status(401).json({ error: "Trek Unavailable" });
    }
    // const businessdata = await Business.findOne({ bId: vehData.businessId });

    let trekRev = new TrekReservation({
      passengerName,
      tickets,
      email,
      phone,
      from,
      businessId: trekData.businessId,
      bookingId: bookingId,
      trekId: id,
    });
    trekRev = await trekRev.save();
    if (!trekRev) {
      return res.status(400).json({ error: "Booking failed" });
    }

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

export const getTrekRev = async (req: Request, res: Response) => {
  try {
    const data = await TrekReservation.find();
    if (data.length > 0) {
      return res.send();
    } else {
      return res.json({ message: "NO Reservations Present" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTrekRevByUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TrekReservation.find({ bookedBy: id });
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.json({ message: "No Bookings Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTrekRevByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TrekReservation.find({ businessId: id });
    if (data.length === 0) {
      return res.json({ message: "No Bookings Found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
