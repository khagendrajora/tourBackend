import { Request, Response } from "express";
import HotDeals from "../../models/HotDeals/HotDeals";
import { customAlphabet } from "nanoid";
import Vehicle from "../../models/Product/vehicle";
import Driver from "../../models/Drivers/Driver";
import Business from "../../models/business";

export const addHotDeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    price,
    sourceAddress,
    destAddress,
    driverId,
    date,
    time,
    termsAndCondition,
  } = req.body;
  const customId = customAlphabet("1234567890", 4);
  let hdID = customId();
  hdID = "hd" + hdID;
  try {
    const vehData = await Vehicle.findOne({ vehId: id });
    if (!vehData) {
      return res.status(400).json({ error: "Vehicle Not found" });
    }

    const businessData = await Business.findOne({ bId: vehData.businessId });
    if (!businessData) {
      return res.status(400).json({ error: "Business Not found" });
    }
    const driverData = await Driver.findOne({ driverId: driverId });
    if (!driverData) {
      return res.status(400).json({ error: "Driver Not found" });
    }

    let data = new HotDeals({
      price,
      sourceAddress,
      destAddress,
      date,
      time,
      termsAndCondition,
      businessName: businessData.businessName,
      vehicleName: vehData.name,
      vehicleId: id,
      businessId: vehData.businessId,
      driverName: driverData.driverName,
      driverPhone: driverData.driverPhone,
      driverId,
      hdID,
      capacity: vehData.capacity,
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
    let data = await HotDeals.find({ hdID: id });
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getHotDealsByVehId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let data = await HotDeals.find({ vehicleId: id });
    if (!data) {
      return res.status(404).json({ error: "failed to get hot deal data" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateHotdeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { price, sourceAddress, destAddress, termsAndCondition, vehicle, time } =
    req.body;
  try {
    const aboutUS = await HotDeals.findOneAndUpdate(
      { hdID: id },
      {
        price,
        sourceAddress,
        destAddress,
        vehicle,
        termsAndCondition,
        time,
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
    const deleteHotDeals = await HotDeals.findOneAndDelete({ vehicleId: id });
    if (!deleteHotDeals) {
      return res.status(404).json({ error: "Failed" });
    }

    return res.status(200).json({ message: "Successfully Removed" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
