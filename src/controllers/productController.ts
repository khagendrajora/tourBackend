import { Request, Response } from "express";
import Tour from "../models/Product/tour";
import Trekking from "../models/Product/trekking";
import Vehicle from "../models/Product/vehicle";
const { customAlphabet } = require("nanoid");

import ReservedDate from "../models/Reservations/ReservedDated";

export const addTour = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let tourId = customId();
  tourId = "TU" + tourId;
  const {
    businessId,
    prodCategory,
    prodsubCategory,
    inclusion,
    dest,
    duration,
    itinerary,
    capacity,
    name,
    phone,
    operationDates,
  } = req.body;

  try {
    let tourImages: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["tourImages"]) {
        tourImages = files["tourImages"].map((file) => file.path);
      }
    }
    let tour = new Tour({
      tourId: tourId,
      businessId,
      prodCategory,
      prodsubCategory,
      inclusion,
      dest,
      duration,
      itinerary,
      capacity,
      name,
      phone,
      operationDates,
      tourImages,
    });
    tour = await tour.save();
    if (!tour) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Tour Registered" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    let tour = await Tour.find();
    if (tour.length > 0) {
      return res.send(tour);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getTourByBusinessId = async (req: Request, res: Response) => {
  const id = req.params.businessid;
  try {
    let tour = await Tour.find({ businessId: id });
    if (tour.length > 0) {
      return res.send(tour);
    } else {
      return res.status(404).json({ error: "No Data found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const tourDetails = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await Tour.findById(id);
    if (!data) {
      return res.status(404).json({ error: "No Data found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    businessId,
    prodCategory,
    prodsubCategory,
    inclusion,
    dest,
    duration,
    itinerary,
    capacity,
    name,
    phone,
    operationDates,
  } = req.body;
  try {
    const tourImages: string[] = req.body.existingTourImages || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["tourImages"]) {
        const uploadedFiles = files["tourImages"].map((file) => file.path);
        tourImages.push(...uploadedFiles);
      }
    }
    const data = await Tour.findByIdAndUpdate(
      id,
      {
        businessId,
        prodCategory,
        prodsubCategory,
        inclusion,
        dest,
        duration,
        itinerary,
        capacity,
        name,
        phone,
        operationDates,
        tourImages,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addTrek = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let trekId = customId();
  trekId = "TR" + trekId;

  const {
    businessId,
    prodCategory,
    prodsubCategory,
    inclusion,
    days,
    dest,
    numbers,
    itinerary,
    capacity,
    name,
    operationDates,
  } = req.body;
  try {
    let trekImages: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["trekImages"]) {
        trekImages = files["trekImages"].map((file) => file.path);
      }
    }

    let trek = new Trekking({
      businessId,
      prodCategory,
      prodsubCategory,
      inclusion,
      days,
      dest,
      trekId: trekId,
      numbers,
      itinerary,
      capacity,
      name,
      operationDates,
      trekImages,
    });
    trek = await trek.save();
    if (!trek) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Trek Registered" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getTrek = async (req: Request, res: Response) => {
  try {
    let trek = await Trekking.find();
    if (trek.length > 0) {
      return res.send(trek);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getTrekByBusinessId = async (req: Request, res: Response) => {
  const id = req.params.businessid;
  try {
    let trek = await Trekking.find({ businessId: id });
    if (trek.length > 0) {
      return res.send(trek);
    } else {
      return res.status(404).json({ error: "No Data Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const trekDetails = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const trek = await Trekking.findById(id);
    if (!trek) {
      return res.status(404).json({ error: "Failed to get Tour" });
    } else {
      return res.send(trek);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTrek = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    businessId,
    prodCategory,
    prodsubCategory,
    inclusion,
    days,
    dest,
    numbers,
    itinerary,
    capacity,
    name,
    operationDates,
  } = req.body;
  try {
    const trekImages: string[] = req.body.existingTrekImages || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["trekImages"]) {
        const uploadedFiles = files["trekImages"].map((file) => file.path);
        trekImages.push(...uploadedFiles);
      }
    }
    const data = await Trekking.findByIdAndUpdate(
      id,
      {
        businessId,
        prodCategory,
        prodsubCategory,
        inclusion,
        days,
        dest,
        numbers,
        itinerary,
        capacity,
        name,
        operationDates,
        trekImages,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addVehicle = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let vehId = customId();
  vehId = "V" + vehId;

  const {
    businessId,
    vehCategory,
    vehSubCategory,
    services,
    amenities,
    vehCondition,
    madeYear,
    vehNumber,
    // quantity,
    capacity,
    name,
    operationDates,
    manufacturer,
    model,
    VIN,
  } = req.body;
  try {
    let vehImages: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["vehImages"]) {
        vehImages = files["vehImages"].map((file) => file.path);
      }
    }
    const vehicleNumber = await Vehicle.findOne({ vehNumber: vehNumber });
    if (vehicleNumber) {
      return res
        .status(400)
        .json({ error: "Vehicle Number already registered" });
    }

    const vehicleVIN = await Vehicle.findOne({ VIN: VIN });
    if (vehicleVIN) {
      return res.status(400).json({ error: "VIN Number already registered" });
    }

    let veh = new Vehicle({
      businessId,
      vehCategory,
      vehSubCategory,
      services,
      vehId: vehId,
      amenities,
      vehCondition,
      madeYear,
      vehNumber,
      // quantity,
      capacity,
      name,
      operationDates,
      vehImages,
      manufacturer,
      model,
      VIN,
    });
    veh = await veh.save();
    if (!veh) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      let revDates = new ReservedDate({
        vehicleId: vehId,
        bookingDate: operationDates,
        bookedBy: businessId,
        bookingId: businessId,
      });
      revDates = await revDates.save();
      if (!revDates) {
        return res
          .status(400)
          .json({ error: "failed to save Operational Dated" });
      } else {
        return res.status(200).json({ message: "Vehicle Registered" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getVeh = async (req: Request, res: Response) => {
  try {
    let veh = await Vehicle.find();
    if (veh.length > 0) {
      return res.send(veh);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getVehicleByBusinessId = async (req: Request, res: Response) => {
  const id = req.params.businessid;
  try {
    let veh = await Vehicle.find({ businessId: id });
    if (veh.length > 0) {
      return res.send(veh);
    } else {
      return res.status(400).json({ error: "No Data Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const vehDetails = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await Vehicle.findOne({ vehId: id });
    if (!data) {
      return res.status(404).json({ error: "Failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateVeh = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    businessId,
    vehCategory,
    vehSubCategory,
    services,
    amenities,
    vehCondition,
    madeYear,
    vehNumber,

    capacity,
    name,
    operationDates,
  } = req.body;
  try {
    let vehImages: string[] = req.body.existingVehImages || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["vehImages"]) {
        const uploadedFiles = files["vehImages"].map((file) => file.path);
        vehImages.push(...uploadedFiles);
      }
    }
    const data = await Vehicle.findByIdAndUpdate(
      id,
      {
        businessId,
        vehCategory,
        vehSubCategory,
        services,
        amenities,
        vehCondition,
        madeYear,
        vehNumber,
        // quantity,
        capacity,
        name,
        operationDates,
        vehImages,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteproduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      const trek = await Trekking.findByIdAndDelete(id);
      if (!trek) {
        const veh = await Vehicle.findByIdAndDelete(id);

        if (!veh) {
          return res.status(400).json({ error: "Not found" });
        } else {
          return res.status(200).json({ message: "Vehicle Deleted" });
        }
      } else {
        return res.status(200).json({ message: "Trek Deleted" });
      }
    } else {
      return res.status(200).json({ message: "Tour Deleted" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};
