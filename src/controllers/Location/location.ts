import { Request, Response } from "express";
import Location from "../../models/Locations/location";
import Country from "../../models/Locations/country";
import Municipality from "../../models/Locations/municipality";
import State from "../../models/Locations/state";
import csv from "csvtojson";

export const addCountry = async (req: Request, res: Response) => {
  let { country } = req.body;
  country = country.toLowerCase();
  try {
    const check = await Country.findOne({ country });
    if (check) {
      return res.status(400).json({ error: "Country Name already Exist" });
    }
    let location = new Country({
      country,
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

export const getCountry = async (req: Request, res: Response) => {
  try {
    let location = await Country.find();
    if (location.length > 0) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Country.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addState = async (req: Request, res: Response) => {
  let { country, state } = req.body;
  state = state.toLowerCase();
  country = country.toLowerCase();
  try {
    const checkCountry = await State.findOne({ country, state });
    if (checkCountry) {
      return res.status(400).json({ error: "State Name already Exist" });
    }

    let location = new State({
      country,
      state,
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

export const getState = async (req: Request, res: Response) => {
  try {
    let location = await State.find();
    if (location.length > 0) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteState = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    State.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addMunicipality = async (req: Request, res: Response) => {
  let { state, municipality, country } = req.body;

  state = state.toLowerCase();
  municipality = municipality.toLowerCase();
  country = country.toLowerCase();
  try {
    const checkMunicipality = await Municipality.findOne({
      country,
      state,
      municipality,
    });
    if (checkMunicipality) {
      return res.status(200).json({ error: "Municipality Already Exist" });
    }
    let location = new Municipality({
      state,
      municipality,
      country,
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
export const getMunicipality = async (req: Request, res: Response) => {
  try {
    let location = await Municipality.find();
    if (location.length > 0) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteMunicipality = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Municipality.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addLocation = async (req: Request, res: Response) => {
  const { country, municipality, state, locationName } = req.body;
  let fullLocation = `${country} ${state} ${municipality} ${locationName}`;
  fullLocation = fullLocation.toLowerCase();
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
  let fullLocation = `${country} ${state} ${municipality} ${locationName}`;
  fullLocation = fullLocation.toLowerCase();
  try {
    const check = await Location.findOne({ fullLocation });
    if (check) {
      return res.status(400).json({ error: "Location already Exist" });
    }
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

export const importUData = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        success: false,
        msg: "No file uploaded",
      });
    }
    const response = await csv().fromFile(req.file.path);

    console.log(response);

    res.send({ status: 200, success: true, msg: "Running", data: response });
  } catch (error: any) {
    res.send({ status: 400, sucess: false, msg: error.message });
  }
};
