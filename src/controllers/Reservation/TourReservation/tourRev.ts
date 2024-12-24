import TourReservation from "../../../models/Reservations/TourReservation/tourRevModel";
import { Request, Response } from "express";
import { sendEmail } from "../../../utils/setEmail";
const { customAlphabet } = require("nanoid");
import Tour from "../../../models/Product/tour";
import TourRevLog from "../../../models/LogModel/TourRevLog";
import User from "../../../models/User/userModel";

export const tourRev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "TuR" + bookingId;

  const { passengerName, tickets, email, phone, date, bookedBy } = req.body;
  try {
    const tourData = await Tour.findOne({ tourId: id });
    if (!tourData) {
      return res.status(401).json({ error: "Tour Unavailable" });
    }

    const userData = await User.findOne({ userId: bookedBy });
    if (!userData) {
      return res.status(401).json({ error: "User Not found" });
    }

    // const businessdata = await Business.findOne({ bId: vehData.businessId });

    let tourRev = new TourReservation({
      bookedBy: userData.userId,
      passengerName,
      tickets,
      email,
      phone,
      date,
      businessId: tourData.businessId,
      bookingId,
      tourId: id,
      tourName: tourData.name,
    });
    tourRev = await tourRev.save();
    if (!tourRev) {
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

export const getTourRev = async (req: Request, res: Response) => {
  try {
    const data = await TourReservation.find();
    if (data.length > 0) {
      return res.send();
    } else {
      return res.json({ message: "NO Tour Reservations" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTourRevByUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TourReservation.find({ bookedBy: id });
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.json({ message: "No Bookings Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTourRevByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TourReservation.find({ businessId: id });
    if (data.length === 0) {
      return res.json({ message: "No Bookings Found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTourRevStatusByClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email } = req.body;
  try {
    const data = await TourReservation.findByIdAndUpdate(
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

    let vehLogs = new TourRevLog({
      updatedBy: email,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();
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

export const updateTourRevStatusByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, bookingId, email, updatedBy } = req.body;
  try {
    const data = await TourReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    let vehLogs = new TourRevLog({
      updatedBy: updatedBy,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();

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
