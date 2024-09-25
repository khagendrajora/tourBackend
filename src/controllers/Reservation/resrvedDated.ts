import { Request, Response } from "express";

import RevDate from "../../models/Reservations/ReservedDated";

export const reservDates = async (req: Request, res: Response) => {
  const { veh_id, bookingDate } = req.body;
  try {
    let revDates = new RevDate({
      veh_id,
      bookingDate,
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

export const getReservDates = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await RevDate.find({ veh_id: id });
    if (data) {
      return res.json(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
