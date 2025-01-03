import { Request, Response } from "express";

import ReservedDate from "../../models/Reservations/ReservedDated";

export const saveReservedDated = async (req: Request, res: Response) => {
  const { vehicleId, bookedBy, bookingDate, time } = req.body;
  try {
    let revDates = new ReservedDate({
      vehicleId,
      bookingDate,
      bookedBy,
      time,
    });
    revDates = await revDates.save();
    if (!revDates) {
      return res.status(400).json({ error: "failed" });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getReservedDates = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await ReservedDate.find({ vehicleId: id });
    if (data.length > 0) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllRevDates = async (req: Request, res: Response) => {
  try {
    const data = await ReservedDate.find();
    if (data.length > 0) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
