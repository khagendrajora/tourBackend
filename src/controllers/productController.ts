import { Request, Response } from "express";
import Tour from "../models/Product/tour";
import Trekking from "../models/Product/trekking";
import Vehicle from "../models/Product/vehicle";

export const addTour = async (req: Request, res: Response) => {
  const {
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
    let tour_images: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["tour_images"]) {
        tour_images = files["tour_images"].map((file) => file.path);
      }
    }
    let tour = new Tour({
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
      tour_images,
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
    if (!tour) {
      return res.status(404).json({ error: "Failed to fetch tour" });
    } else {
      return res.send(tour);
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
      return res.status(404).json({ error: "Failed to get Tour" });
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
    const tour_images: string[] = req.body.existingTour_images || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["tour_images"]) {
        const uploadedFiles = files["tour_images"].map((file) => file.path);
        tour_images.push(...uploadedFiles);
      }
    }
    const data = await Tour.findByIdAndUpdate(
      id,
      {
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
        tour_images,
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
  const {
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
    let trek_images: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["trek_images"]) {
        trek_images = files["trek_images"].map((file) => file.path);
      }
    }

    let trek = new Trekking({
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
      trek_images,
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
    if (!trek) {
      return res.status(404).json({ error: "Failed to fetch tour" });
    } else {
      return res.send(trek);
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
    const trek_images: string[] = req.body.existingTrek_images || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["trek_images"]) {
        const uploadedFiles = files["trek_images"].map((file) => file.path);
        trek_images.push(...uploadedFiles);
      }
    }
    const data = await Trekking.findByIdAndUpdate(
      id,
      {
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
        trek_images,
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
  const {
    veh_Category,
    veh_subCategory,
    services,
    amenities,
    veh_condition,
    madeYear,
    veh_number,
    quantity,
    capacity,
    name,
    operationDates,
  } = req.body;
  try {
    let veh_images: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["veh_images"]) {
        veh_images = files["veh_images"].map((file) => file.path);
      }
    }

    let veh = new Vehicle({
      veh_Category,
      veh_subCategory,
      services,
      amenities,
      veh_condition,
      madeYear,
      veh_number,
      quantity,
      capacity,
      name,
      operationDates,
      veh_images,
    });
    veh = await veh.save();
    if (!veh) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Vehicle Registered" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getVeh = async (req: Request, res: Response) => {
  try {
    let veh = await Vehicle.find();
    if (!veh) {
      return res.status(404).json({ error: "Failed to fetch tour" });
    } else {
      return res.send(veh);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const vehDetails = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await Vehicle.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Failed to get Tour" });
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
    veh_Category,
    veh_subCategory,
    services,
    amenities,
    veh_condition,
    madeYear,
    veh_number,
    quantity,
    capacity,
    name,
    operationDates,
  } = req.body;
  try {
    let veh_images: string[] = req.body.existingVeh_images || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["veh_images"]) {
        const uploadedFiles = files["veh_images"].map((file) => file.path);
        veh_images.push(...uploadedFiles);
      }
    }
    const data = await Vehicle.findByIdAndUpdate(
      id,
      {
        veh_Category,
        veh_subCategory,
        services,
        amenities,
        veh_condition,
        madeYear,
        veh_number,
        quantity,
        capacity,
        name,
        operationDates,
        veh_images,
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
