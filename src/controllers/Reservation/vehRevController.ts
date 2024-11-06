import { Request, Response } from "express";
import VehRev from "../../models/Reservations/vehReserv";
import Vehicle from "../../models/Product/vehicle";
import RevDate from "../../models/Reservations/ReservedDated";

export const veh_Rev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    passengerName,
    age,
    email,
    phone,
    sourceAddress,
    destAddress,
    bookingDate,
    address,
  } = req.body;

  try {
    const vehData = await Vehicle.findOne({ _id: id });
    if (!vehData) {
      return res.status(401).json({ error: "not found" });
    }

    let vehRev = new VehRev({
      vehId: vehData._id,
      vehType: vehData.vehCategory,
      services: vehData.services,
      amenities: vehData.amenities,
      vehNumber: vehData.vehNumber,
      capacity: vehData.capacity,
      veh_name: vehData.name,
      passengerName,
      age,
      sourceAddress,
      destAddress,
      email,
      phone,
      bookingDate,
      address,
    });
    vehRev = await vehRev.save();
    if (!vehRev) {
      return res.status(400).json({ error: "Booking failed" });
    } else {
      let resrvDate = new RevDate({
        vehId: vehData._id,
        bookingDate,
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
