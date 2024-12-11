"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.getLocationDetails = exports.getLocation = exports.addLocation = exports.deleteMunicipality = exports.getMunicipality = exports.addMunicipality = exports.deleteState = exports.getState = exports.addState = exports.deleteCountry = exports.getCountry = exports.addCountry = void 0;
const location_1 = __importDefault(require("../../models/Locations/location"));
const country_1 = __importDefault(require("../../models/Locations/country"));
const municipality_1 = __importDefault(require("../../models/Locations/municipality"));
const state_1 = __importDefault(require("../../models/Locations/state"));
const addCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { country } = req.body;
    country = country.toLowerCase();
    try {
        // const newState = state.map((item) => item.toLowerCase().trim());
        const check = yield country_1.default.findOne({ country });
        if (check) {
            return res.status(400).json({ error: "Country Name already Exist" });
        }
        let location = new country_1.default({
            country,
        });
        location = yield location.save();
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
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addCountry = addCountry;
const getCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let location = yield country_1.default.find();
        if (location.length > 0) {
            return res.send(location);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getCountry = getCountry;
const deleteCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        country_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteCountry = deleteCountry;
const addState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { country, state } = req.body;
    state = state.toLowerCase();
    country = country.toLowerCase();
    try {
        const checkCountry = yield state_1.default.findOne({ country });
        if (checkCountry) {
            const checkState = yield checkCountry.state.includes(state);
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
        let location = new state_1.default({
            country,
            state,
        });
        location = yield location.save();
        if (!location) {
            return res.status(409).json({ error: "Failed to add" });
        }
        return res.status(200).json({ message: "Added" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addState = addState;
const getState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let location = yield state_1.default.find();
        if (location.length > 0) {
            return res.send(location);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getState = getState;
const deleteState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        state_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteState = deleteState;
const addMunicipality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { state, municipality, country } = req.body;
    state = state.toLowerCase();
    municipality = municipality.toLowerCase();
    country = country.toLowerCase();
    try {
        const checkState = yield municipality_1.default.findOne({ state });
        if (checkState) {
            const checkMunicipality = yield checkState.municipality.includes(municipality);
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
        let location = new municipality_1.default({
            state,
            municipality,
            country,
        });
        location = yield location.save();
        if (!location) {
            return res.status(409).json({ error: "Failed to add" });
        }
        return res.status(200).json({ message: "Added" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addMunicipality = addMunicipality;
const getMunicipality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let location = yield municipality_1.default.find();
        if (location.length > 0) {
            return res.send(location);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getMunicipality = getMunicipality;
const deleteMunicipality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        location_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteMunicipality = deleteMunicipality;
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
const addLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, municipality, state, locationName } = req.body;
    let fullLocation = `${country} ${state} ${municipality} ${locationName}`;
    fullLocation = fullLocation.toLowerCase();
    try {
        const check = yield location_1.default.findOne({ fullLocation });
        if (check) {
            return res.status(400).json({ error: "Location already Exist" });
        }
        let location = new location_1.default({
            country,
            municipality,
            state,
            locationName,
            fullLocation,
        });
        location = yield location.save();
        if (!location) {
            return res.status(409).json({ error: "Failed to add" });
        }
        return res.status(200).json({ message: "Added" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addLocation = addLocation;
const getLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let location = yield location_1.default.find();
        if (location.length > 0) {
            return res.send(location);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getLocation = getLocation;
const getLocationDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let location = yield location_1.default.findById(id);
        if (location) {
            return res.send(location);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getLocationDetails = getLocationDetails;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { country, municipality, state, locationName } = req.body;
    let fullLocation = `${country} ${state} ${municipality} ${locationName}`;
    fullLocation = fullLocation.toLowerCase();
    try {
        const check = yield location_1.default.findOne({ fullLocation });
        if (check) {
            return res.status(400).json({ error: "Location already Exist" });
        }
        const location = yield location_1.default.findByIdAndUpdate(id, { country, municipality, state, locationName, fullLocation }, { new: true });
        if (!location) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        return res.status(200).json({ message: "Successfully Updated" });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.updateLocation = updateLocation;
const deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        location_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed to delete" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteLocation = deleteLocation;
