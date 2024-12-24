import TrekReservation from "../../../models/Reservations/TrekReservation/TrekRevModel";
import { Request, Response } from "express";
import { sendEmail } from "../../../utils/setEmail";
const { customAlphabet } = require("nanoid");
import User from "../../../models/User/userModel";
import Trekking from "../../../models/Product/trekking";
import TrekRevLog from "../../../models/LogModel/TrekRevLog";

export const trekRev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "TrR" + bookingId;

  const { passengerName, tickets, email, phone, date, bookedBy } = req.body;
  try {
    const trekData = await Trekking.findOne({ trekId: id });
    if (!trekData) {
      return res.status(401).json({ error: "Trek Unavailable" });
    }
    const userData = await User.findOne({ userId: bookedBy });
    if (!userData) {
      return res.status(401).json({ error: "User Not found" });
    }
    // const businessdata = await Business.findOne({ bId: vehData.businessId });

    let trekRev = new TrekReservation({
      bookedBy,
      passengerName,
      tickets,
      email,
      phone,
      date,
      businessId: trekData.businessId,
      bookingId,
      trekName: trekData.name,
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
      return res.send(data);
    } else {
      return res.json({ message: "NO Trek Reservations " });
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

export const updateTrekRevStatusByClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email } = req.body;
  try {
    const data = await TrekReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    // const revDate = await ReservedDate.findOneAndDelete({
    //   bookingId: bookingId,
    // });
    // if (!revDate) {
    //   return res.status(400).json({ error: "failed to Update" });
    // }

    let Logs = new TrekRevLog({
      updatedBy: email,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    Logs = await Logs.save();
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTrekRevStatusByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, bookingId, email, updatedBy } = req.body;
  try {
    const data = await TrekReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    let Logs = new TrekRevLog({
      updatedBy: updatedBy,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    Logs = await Logs.save();

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
