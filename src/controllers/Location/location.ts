import { Request, Response } from "express";
import Location from "../../models/Locations/location";

export const addLocation = async (req: Request, res: Response) => {
  const { country, municipality, state, locationName } = req.body;
  const fullLocation = `${country}, ${municipality}, ${state}, ${locationName}`;
  try {
    const check = await Location.findOne({ fullLocation });
    if (check) {
      return res.status(400).json({ error: "Location already Exist" });
    }
    let location = new Location({
      country,
      municipality,
      state,
      locationName,
      fullLocation,
    });
    location = await location.save();
    if (!location) {
      return res.status(409).json({ error: "Failed to add" });
    }
    return res.status(200).json({ message: "Added" });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    let location = await Location.find();
    if (location.length > 0) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
export const getLocationDetails = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let location = await Location.findById(id);
    if (location) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { country, municipality, state, locationName } = req.body;
  const fullLocation = `${country}, ${municipality}, ${state}, ${locationName}`;

  try {
    const location = await Location.findByIdAndUpdate(
      id,
      { country, municipality, state, locationName, fullLocation },
      { new: true }
    );
    if (!location) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    }
    return res.status(200).json({ message: "Successfully Updated" });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Location.findByIdAndDelete(id).then((data) => {
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
