import { Request, Response } from "express";
import VehicleReservation from "../../models/Reservations/vehReserv";
import Vehicle from "../../models/Product/vehicle";
import ReservedDate from "../../models/Reservations/ReservedDated";
import { customAlphabet } from "nanoid";

export const vehReservation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  const bookingId = customId();
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
  } = req.body;

  try {
    const vehData = await Vehicle.findOne({ _id: id });
    if (!vehData) {
      return res.status(401).json({ error: "Vehicle Unavailable" });
    }

    let vehRev = new VehicleReservation({
      vehicleId: vehData._id,
      vehicleType: vehData.vehCategory,
      // services: vehData.services,
      // amenities: vehData.amenities,
      vehicleNumber: vehData.vehNumber,
      capacity: vehData.capacity,
      vehicleName: vehData.name,
      bookingId: bookingId,
      bookedBy,
      age,
      sourceAddress,
      destinationAddress,
      email,
      phone,
      bookingDate,
      address,
      bookingName,
    });
    vehRev = await vehRev.save();
    if (!vehRev) {
      return res.status(400).json({ error: "Booking failed" });
    } else {
      let resrvDate = new ReservedDate({
        vehicleId: vehData._id,
        bookingDate,
        bookedBy,
        bookingId: bookingId,
      });
      resrvDate = await resrvDate.save();
      if (!resrvDate) {
        return res.status(400).json({ error: "failed to save date" });
      } else {
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
  const { status, bookingId } = req.body;
  try {
    const data = await VehicleReservation.findByIdAndUpdate(id, {
      status: status,
    });
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    } else {
      const revDate = await ReservedDate.findOneAndDelete({
        bookingId: bookingId,
      });
      if (!revDate) {
        return res.status(400).json({ error: "failed to Update" });
      } else {
        return res.status(200).json({ message: status });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
