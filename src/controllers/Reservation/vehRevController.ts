import { Request, Response } from "express";
import VehicleReservation from "../../models/Reservations/vehReserv";
import Vehicle from "../../models/Product/vehicle";
import ReservedDate from "../../models/Reservations/ReservedDated";
const { customAlphabet } = require("nanoid");
import { sendEmail } from "../../utils/setEmail";
import Business from "../../models/business";

export const vehReservation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "R" + bookingId;

  const {
    bookingName,
    age,
    email,
    phone,
    sourceAddress,
    destinationAddress,
    bookingDate,
    address,
    bookedBy,
    bookedByName,
    numberOfPassengers,
  } = req.body;

  try {
    const vehData = await Vehicle.findOne({ vehId: id });
    if (!vehData) {
      return res.status(401).json({ error: "Vehicle Unavailable" });
    }
    const businessdata = await Business.findOne({ bId: vehData.businessId });

    let vehRev = new VehicleReservation({
      vehicleId: vehData.vehId,
      vehicleType: vehData.vehCategory,

      vehicleNumber: vehData.vehNumber,
      capacity: vehData.capacity,
      vehicleName: vehData.name,
      bookingId: bookingId,
      businessId: vehData.businessId,
      vehicleImage: vehData.vehImages?.length ? vehData.vehImages : [],
      bookedBy,
      bookedByName,
      age,
      sourceAddress,
      destinationAddress,
      email,
      phone,
      bookingDate,
      address,
      bookingName,
      numberOfPassengers,
    });
    vehRev = await vehRev.save();
    if (!vehRev) {
      return res.status(400).json({ error: "Booking failed" });
    } else {
      let resrvDate = new ReservedDate({
        vehicleId: id,
        bookingDate,
        bookedBy,
        bookingId: bookingId,
      });
      resrvDate = await resrvDate.save();
      if (!resrvDate) {
        return res.status(400).json({ error: "failed to save date" });
      } else {
        await Vehicle.findByIdAndUpdate(
          id,
          {
            operationDates: bookingDate,
          },
          { new: true }
        );

        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: email,
          subject: "Booking Confirmation",
          html: `<h2>Your booking has been successfully Created with Booking Id ${bookingId} </h2>`,
        });
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: businessdata?.primaryEmail,
          subject: "New Booking",
          html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${vehData._id}</h2>`,
        });
        return res.status(200).json({ message: "Booked" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRevByClientId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ bookedBy: id });
    if (data.length > 0) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, bookingId, email } = req.body;
  try {
    const data = await VehicleReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    } else {
      const revDate = await ReservedDate.findOneAndDelete({
        bookingId: bookingId,
      });
      if (!revDate) {
        return res.status(400).json({ error: "failed to Update" });
      }
      sendEmail({
        from: "beta.toursewa@gmail.com",
        to: email,
        subject: "Booking Status",
        html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
      });
      return res.status(200).json({ message: status });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRevByBusinessId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ businessId: id });
    if (data.length === 0) {
      return res.status(404).json({ error: "No Data found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, email } = req.body;
  try {
    const data = await VehicleReservation.findOneAndUpdate(
      { bookingId: id },
      { status: status },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to update" });
    } else {
      const revDate = await ReservedDate.findOneAndDelete({
        bookingId: id,
      });
      if (!revDate) {
        return res.status(400).json({ error: "Failed" });
      }
      sendEmail({
        from: "beta.toursewa@gmail.com",
        to: email,
        subject: "Booking Status",
        html: `<h2>Your Booking with booking id ${id} has been ${status}</h2>`,
      });
      return res.status(200).json({ message: status });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const data = await VehicleReservation.find();
    if (data.length > 0) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
