import { Request, Response } from "express";
import VehicleReservation from "../../models/Reservations/vehReserv";
import Vehicle from "../../models/Product/vehicle";
import ReservedDate from "../../models/Reservations/ReservedDated";
const { customAlphabet } = require("nanoid");
import { sendEmail } from "../../utils/setEmail";
import Business from "../../models/business";
import VeVehRevLogs from "../../models/LogModel/VehRevLogs";
import VehRevLogs from "../../models/LogModel/VehRevLogs";

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
    startDate,
    endDate,
    address,
    bookedBy,
    bookedByName,
    numberOfPassengers,
  } = req.body;
  let bookingDate: string[] = [];
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  while (newStartDate <= newEndDate) {
    bookingDate.push(newStartDate.toISOString().split("T")[0]);
    newStartDate.setDate(newStartDate.getDate() + 1);
  }
  try {
    const vehData = await Vehicle.findOne({ vehId: id });
    if (!vehData) {
      return res.status(401).json({ error: "Vehicle Unavailable" });
    }
    const businessdata = await Business.findOne({ bId: vehData.businessId });

    let vehRev = new VehicleReservation({
      vehicleId: id,
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
      startDate,
      endDate,
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
        // await Vehicle.findOneAndUpdate(
        //   { vehId: id },
        //   {
        //     operationDates: bookingDate,
        //   },
        //   { new: true }
        // );

        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: email,
          subject: "Booking Confirmation",
          html: `
          <div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your booking has been successfully Created with Booking Id ${bookingId}</p>

          </div>
        </div>
      </div> `,
        });
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: businessdata?.primaryEmail,
          subject: "New Booking",
          html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
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
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationStatusByClient = async (
  req: Request,
  res: Response
) => {
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
    }

    const revDate = await ReservedDate.findOneAndDelete({
      bookingId: bookingId,
    });
    if (!revDate) {
      return res.status(400).json({ error: "failed to Update" });
    }

    let vehLogs = new VehRevLogs({
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
      html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your Booking  ${bookingId} has been updated to ${status}</p>

          </div>
        </div>
      </div> `,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationStatusByBid = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email, updatedBy } = req.body;
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
    }

    let vehLogs = new VehRevLogs({
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
      html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your Booking  ${bookingId} has been updated to ${status}</p>

          </div>
        </div>
      </div> `,
    });
    return res.status(200).json({ message: status });
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

export const getRevByVehicleId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ vehicleId: id });
    if (data.length === 0) {
      return res.status(404).json({ error: "No Reservations found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, email, updatedBy } = req.body;
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
      let vehLogs = new VehRevLogs({
        updatedBy: updatedBy,
        status: status,
        bookingId: id,
        time: new Date(),
      });
      vehLogs = await vehLogs.save();
      sendEmail({
        from: "beta.toursewa@gmail.com",
        to: email,
        subject: "Booking Status",
        html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your Booking  ${id} has been updated to ${status}</p>

          </div>
        </div>
      </div> `,
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
    } else {
      return res.status(400).json({ error: "No Vehicle Revservatrions " });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
