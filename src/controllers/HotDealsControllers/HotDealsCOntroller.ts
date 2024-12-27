import { Request, Response } from "express";
import HotDeals from "../../models/HotDeals/HotDeals";

export const addHotDeals = async (req: Request, res: Response) => {
  const { price, sourceAddress, destAddress, vehicle } = req.body;
  try {
    let data = new HotDeals({
      price,
      sourceAddress,
      destAddress,
      vehicle,
    });
    data = await data.save();
    if (!data) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Added" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getHotDeals = async (req: Request, res: Response) => {
  try {
    let data = await HotDeals.find();
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
export const getHotDealsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let data = await HotDeals.findById(id);
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateHotdeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { price, sourceAddress, destAddress, vehicle } = req.body;
  try {
    const aboutUS = await HotDeals.findByIdAndUpdate(
      id,
      {
        price,
        sourceAddress,
        destAddress,
        vehicle,
      },
      { new: true }
    );
    if (!aboutUS) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteHotDeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    HotDeals.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
