import { Request, Response } from "express";
import VehRev from "../../models/Reservations/vehReserv";
import Vehicle from "../../models/Product/vehicle";
import RevDate from "../../models/Reservations/ReservedDated";

export const veh_Rev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    passenger_name,
    age,
    email,
    phone,
    sourceAdd,
    destAdd,
    bookingDate,
    address,
  } = req.body;

  try {
    const veh_data = await Vehicle.findOne({ _id: id });
    if (!veh_data) {
      return res.status(401).json({ error: "not found" });
    }

    let veh_rev = new VehRev({
      veh_id: veh_data._id,
      veh_type: veh_data.veh_Category,
      services: veh_data.services,
      amenities: veh_data.amenities,
      veh_number: veh_data.veh_number,
      capacity: veh_data.capacity,
      veh_name: veh_data.name,
      passenger_name,
      age,
      sourceAdd,
      destAdd,
      email,
      phone,
      bookingDate,
      address,
    });
    veh_rev = await veh_rev.save();
    if (!veh_rev) {
      return res.status(400).json({ error: "Booking failed" });
    } else {
      let resrvDate = new RevDate({
        veh_id: veh_data._id,
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
