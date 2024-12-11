import { Request, Response } from "express";
import Location from "../../models/Locations/location";
import Country from "../../models/Locations/country";
import Municipality from "../../models/Locations/municipality";
import State from "../../models/Locations/state";

export const addCountry = async (req: Request, res: Response) => {
  let { country } = req.body;
  country = country.toLowerCase();
  try {
    // const newState = state.map((item) => item.toLowerCase().trim());
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
    // if (state) {
    //   let statedata = new State({
    //     country,
    //     state,
    //   });
    //   statedata = await statedata.save();
    //   if (!statedata) {
    //     return res.status(400).json({ error: "Failed to add state" });
    //   }
    // }
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
    const checkCountry = await State.findOne({ country });
    if (checkCountry) {
      const checkState = await checkCountry.state.includes(state);
      if (checkState) {
        return res.status(400).json({ error: "State Name already Exist" });
      }
    }

    // const check = checkCountry.state && checkCountry.state.includes(state);
    // if (check) {
    //   return res.status(400).json({ error: "State Name already Exist" });
    // }
    // checkCountry.state?.push(state);
    // await checkCountry.save();
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
    const checkState = await Municipality.findOne({ state });
    if (checkState) {
      const checkMunicipality = await checkState.municipality.includes(
        municipality
      );
      if (checkMunicipality) {
        return res.status(200).json({ error: "Municipality Already Exist" });
      }
    }

    // const check =
    //   checkState.municipality && checkState.municipality.includes(municipality);
    // // const check = await Municipality.findOne({ municipality });
    // if (check) {
    //   return res.status(400).json({ error: "Municipality Name already Exist" });
    // }

    // checkState.municipality?.push(newMunicipality);
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
    Location.findByIdAndDelete(id).then((data) => {
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

// export const addMunicipality = async (req: Request, res: Response) => {
//   let { municipality, locations } = req.body;
//   municipality = municipality.toLowerCase();
//   try {
//     const check = await Location.findOne({ municipality });
//     if (check) {
//       return res.status(400).json({ error: "Municipality Name already Exist" });
//     }
//     let location = new Municipality({
//       municipality,
//       locations,
//     });
//     location = await location.save();
//     if (!location) {
//       return res.status(409).json({ error: "Failed to add" });
//     }
//     return res.status(200).json({ message: "Added" });
//   } catch (error: any) {
//     res.status(500).json({ error: error });
//   }
// };

// export const addCountryState = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   let { state } = req.body;

//   if (!Array.isArray(state)) {
//     return res.status(400).json({ error: "Data must be an array format" });
//   }
//   try {
//     const newState = state.map((item) => item.toLowerCase().trim());
//     const checkCountry = await Country.findById(id);
//     if (!checkCountry) {
//       return res.status(200).json({ error: "Country Not Found" });
//     }
//     const stateCheck = newState.some((item) =>
//       checkCountry.state?.includes(item)
//     );

//     if (stateCheck) {
//       return res.status(200).json({ error: "State Already Exist" });
//     }

//     const data = await Country.findOneAndUpdate(
//       { _id: id },
//       { $push: { state: { $each: newState } } },
//       { new: true }
//     );

//     // const inState = await State.findOne({ checkCountry });
//     // if (inState) {
//     //   const newData = await State.findOneAndUpdate({ checkCountry }, state);
//     // }

//     if (data) {
//       return res.status(200).json({ message: "State Added" });
//     } else {
//       return res.status(404).json({ error: "Failed" });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };

// export const addStateMunicipality = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   let { municipality } = req.body;

//   if (!Array.isArray(municipality)) {
//     return res.status(400).json({ error: "Data must be an array format" });
//   }
//   try {
//     const newMunicipality = municipality.map((item) =>
//       item.toLowerCase().trim()
//     );
//     const checkState = await State.findById(id);
//     if (!checkState) {
//       return res.status(200).json({ error: "State Not Found" });
//     }
//     const municipalityCheck = newMunicipality.some((item) =>
//       checkState.state?.includes(item)
//     );

//     if (municipalityCheck) {
//       return res.status(200).json({ error: "municipality Already Exist" });
//     }

//     const data = await State.findOneAndUpdate(
//       { _id: id },
//       { $push: { municipality: { $each: newMunicipality } } },
//       { new: true }
//     );

//     if (data) {
//       return res.status(200).json({ message: "Municipality Added" });
//     } else {
//       return res.status(404).json({ error: "Failed" });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };

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
