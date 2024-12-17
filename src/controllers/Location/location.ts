import { Request, Response } from "express";
import Location from "../../models/Locations/location";
import Country from "../../models/Locations/country";
import Municipality from "../../models/Locations/municipality";
import State from "../../models/Locations/state";
import District from "../../models/Locations/Districts";
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
  let { state } = req.body;
  state = state.toLowerCase();
  // country = country.toLowerCase();
  try {
    const checkState = await State.findOne({ state });
    if (checkState) {
      return res.status(400).json({ error: "State Name already Exist" });
    }

    let location = new State({
      // country,
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

export const addDistrict = async (req: Request, res: Response) => {
  let { district, state } = req.body;
  state = state.toLowerCase();
  district = district.toLowerCase();
  try {
    const checkDistrict = await District.findOne({ district, state });
    if (checkDistrict) {
      return res.status(400).json({ error: "District Name already Exist" });
    }

    let location = new District({
      district,
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

export const getDistrict = async (req: Request, res: Response) => {
  try {
    let location = await District.find();
    if (location.length > 0) {
      return res.send(location);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteDistrict = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    District.findByIdAndDelete(id).then((data) => {
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
  const { country, municipality, district, geo, state, locationName } =
    req.body;
  let fullLocation = `${district} ${locationName}`;
  fullLocation = fullLocation.toLowerCase();
  try {
    const check = await Location.findOne({ fullLocation });
    if (check) {
      return res.status(400).json({ error: "Location already Exist" });
    }
    let location = new Location({
      country,
      municipality,
      district,
      state,
      geo,
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
  let { country, municipality, district, geo, state, locationName } = req.body;
  let fullLocation = ` ${district} ${locationName}`;
  fullLocation = fullLocation.toLowerCase();
  try {
    const check = await Location.findOne({ fullLocation });
    if (check) {
      return res.status(400).json({ error: "Location already Exist" });
    }
    const location = await Location.findByIdAndUpdate(
      id,
      {
        country,
        municipality,
        district,
        geo,
        state,
        locationName,
        fullLocation,
      },
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
    // let data: [] = [];
    const response = await csv().fromFile(req.file.path);

    const newData = response.map((row: any) => ({
      state: "Bagmati Province",
      district: "Kathmandu",
      municipality: row.municipality,
    }));

    await Municipality.insertMany(newData);

    // await fs.unlink(filePath);

    res.send({ status: 200, success: true, msg: "Running", data: response });
  } catch (error: any) {
    res.send({ status: 400, sucess: false, msg: error.message });
  }
};

export const importLalitpur = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        success: false,
        msg: "No file uploaded",
      });
    }
    // let data: [] = [];
    const response = await csv().fromFile(req.file.path);

    const newData = response.map((row: any) => ({
      state: "Bagmati Province",
      district: "Lalitpur",
      municipality: row.municipality,
    }));

    await Municipality.insertMany(newData);

    // await fs.unlink(filePath);

    res.send({ status: 200, success: true, msg: "Running", data: response });
  } catch (error: any) {
    res.send({ status: 400, sucess: false, msg: error.message });
  }
};

export const importBhaktapur = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        success: false,
        msg: "No file uploaded",
      });
    }
    // let data: [] = [];
    const response = await csv().fromFile(req.file.path);

    const newData = response.map((row: any) => ({
      state: "Bagmati Province",
      district: "Bhaktapur District",
      municipality: row.municipality,
    }));

    await Municipality.insertMany(newData);

    // await fs.unlink(filePath);

    res.send({ status: 200, success: true, msg: "Running", data: response });
  } catch (error: any) {
    res.send({ status: 400, sucess: false, msg: error.message });
  }
};

// export const importGandaki = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "Gandaki Province",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };
// export const importLumbini = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "Lumbini Province",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };

// export const importsudur = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "Sudurpashchim Province",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };

// export const importkarnali = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "Karnali Province",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };
// export const importprov2 = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "province 2",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };
// export const importprov1 = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({
//         status: 400,
//         success: false,
//         msg: "No file uploaded",
//       });
//     }
//     // let data: [] = [];
//     const response = await csv().fromFile(req.file.path);

//     const newData = response.map((row: any) => ({
//       state: "province 1",
//       district: row.district,
//     }));

//     await District.insertMany(newData);

//     // await fs.unlink(filePath);

//     res.send({ status: 200, success: true, msg: "Running", data: response });
//   } catch (error: any) {
//     res.send({ status: 400, sucess: false, msg: error.message });
//   }
// };
