import { Request, Response } from "express";
import Tour from "../models/Product/tour";
import Trekking from "../models/Product/trekking";
import Vehicle from "../models/Product/vehicle";
const { customAlphabet } = require("nanoid");
import ProductLogs from "../models/LogModel/ProductLogs";
import { v2 as cloudinary } from "cloudinary";
// import fileUpload, { UploadedFile } from "express-fileupload";

cloudinary.config({
  cloud_name: "dwepmpy6w",
  api_key: "934775798563485",
  api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});

// Tour Controller
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
    price,
    itinerary,
    capacity,
    name,
    phone,
    operationDates,
    addedBy,
  } = req.body;

  try {
    if (!req.files || !(req.files as any).tourImages) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const fileArray = req.files as any;
    const files = Array.isArray(fileArray.tourImages)
      ? fileArray.tourImages
      : [fileArray.tourImages];

    if (!files) {
      return res.status(400).json({ message: "No image array uploaded" });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "tour",
          use_filename: true,
          unique_filename: false,
        });
        return result.secure_url;
      })
    );
    if (!itinerary) {
      return res.status(400).json({ error: "Itinerary is required" });
    }
    let tour = new Tour({
      tourId: tourId,
      businessId,
      prodCategory,
      prodsubCategory,
      inclusion,
      dest,
      price,
      addedBy,
      duration,
      itinerary,
      capacity,
      name,
      phone,
      operationDates,
      tourImages: uploadedImages,
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
    const data = await Tour.findOne({ tourId: id });
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
    price,
    name,
    phone,
    updatedBy,
    operationDates,
  } = req.body;
  try {
    let existingTourImages: string[] = req.body.existingTourImages || [];
    let tourImages: string[] = existingTourImages || [];

    // if (req.files) {
    //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    //   if (files["tourImages"]) {
    //     const uploadedFiles = files["tourImages"].map((file) => file.path);
    //     tourImages.push(...uploadedFiles);
    //   }
    // }

    if (req.files && (req.files as any).tourImages) {
      const fileArray = req.files as any;
      const files = Array.isArray(fileArray.tourImages)
        ? fileArray.tourImages
        : [fileArray.tourImages];

      const uploadedImages = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "tour",
            use_filename: true,
            unique_filename: false,
          });
          return result.secure_url;
        })
      );
      tourImages.push(...uploadedImages);
    }
    const data = await Tour.findOneAndUpdate(
      { tourId: id },
      {
        businessId,
        prodCategory,
        prodsubCategory,
        inclusion,
        dest,
        duration,
        itinerary,
        capacity,
        price,
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
      let productLog = new ProductLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "Updated",
        time: new Date(),
      });
      productLog = await productLog.save();
      return res.status(200).json({ message: "success", data });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Trek controller

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
    price,
    numbers,
    itinerary,
    capacity,
    addedBy,
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

    if (!itinerary) {
      return res.status(400).json({ error: "Itinerary is required" });
    }
    let trek = new Trekking({
      businessId,
      prodCategory,
      prodsubCategory,
      inclusion,
      days,
      addedBy,
      dest,
      price,
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
    const trek = await Trekking.findOne({ trekId: id });
    if (!trek) {
      return res.status(404).json({ error: "Failed to get Trek" });
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
    price,
    numbers,
    updatedBy,
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
    const data = await Trekking.findOneAndUpdate(
      { trekId: id },
      {
        businessId,
        prodCategory,
        prodsubCategory,
        inclusion,
        days,
        dest,
        numbers,
        price,
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
      let productLog = new ProductLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "Updated",
        time: new Date(),
      });
      productLog = await productLog.save();
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Vehicle Controller

export const addVehicle = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let vehId = customId();
  vehId = "V" + vehId;

  const {
    businessId,
    vehCategory,
    vehSubCategory,
    services,
    baseLocation,
    addedBy,
    amenities,
    vehCondition,
    price,
    description,
    madeYear,
    vehNumber,
    businessName,
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
    const vehicleNumber = await Vehicle.findOne({
      vehNumber: vehNumber,
    });
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
      addedBy,
      price,
      description,
      amenities,
      vehCondition,
      madeYear,
      vehNumber,
      baseLocation,
      businessName,
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
    }

    return res.status(200).json({ message: "Vehicle Registered" });
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
    baseLocation,
    vehCondition,
    price,
    description,
    madeYear,
    updatedBy,
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

    const vehData = await Vehicle.findOne({ vehId: id });
    if (!vehData) {
      return res.status(400).json({ error: "Vehicle Not Found" });
    }

    const numberCheck = await Vehicle.findOne({
      vehNumber: { $ne: vehData.vehNumber },
      $or: [{ vehNumber: vehNumber }],
    });

    if (numberCheck) {
      return res
        .status(400)
        .json({ error: "Vehicle Number already Registered" });
    }

    const updateData: { [key: string]: any } = {
      businessId,
      vehCategory,
      vehSubCategory,
      services,
      amenities,
      description,
      vehCondition,
      madeYear,
      price,

      vehNumber,
      baseLocation,
      capacity,
      name,
      vehImages,
    };

    if (services !== undefined) {
      if (Array.isArray(services) && services.length === 0) {
        updateData.services = [];
      } else {
        updateData.services = services;
      }
    } else {
      updateData.services = [];
    }

    if (amenities !== undefined) {
      if (Array.isArray(amenities) && amenities.length === 0) {
        updateData.amenities = [];
      } else {
        updateData.amenities = amenities;
      }
    } else {
      updateData.amenities = [];
    }

    if (operationDates !== undefined) {
      if (Array.isArray(operationDates) && operationDates.length === 0) {
        updateData.operationDates = [];
      } else {
        updateData.operationDates = operationDates;
      }
    } else {
      updateData.operationDates = [];
    }

    const data = await Vehicle.findOneAndUpdate(
      { vehId: id },
      updateData,

      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      let productLog = new ProductLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "Updated",
        time: new Date(),
      });
      productLog = await productLog.save();
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteproduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { updatedBy } = req.query;
  try {
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      const trek = await Trekking.findByIdAndDelete(id);
      if (!trek) {
        const veh = await Vehicle.findByIdAndDelete(id);

        if (!veh) {
          return res.status(400).json({ error: "Not found" });
        } else {
          let productLog = new ProductLogs({
            updatedBy: updatedBy,
            productId: veh.vehId,
            action: "Deleted",
            time: new Date(),
          });
          productLog = await productLog.save();
          return res.status(200).json({ message: "Vehicle Deleted" });
        }
      } else {
        let productLog = new ProductLogs({
          updatedBy: updatedBy,
          productId: trek.trekId,
          action: "Deleted",
          time: new Date(),
        });
        productLog = await productLog.save();
        return res.status(200).json({ message: "Trek Deleted" });
      }
    } else {
      let productLog = new ProductLogs({
        updatedBy: updatedBy,
        productId: tour.tourId,
        action: "Deleted",
        time: new Date(),
      });
      productLog = await productLog.save();
      return res.status(200).json({ message: "Tour Deleted" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};
