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
exports.deleteLocation = exports.updateLocation = exports.getLocationDetails = exports.getLocation = exports.addLocation = void 0;
const location_1 = __importDefault(require("../../models/Locations/location"));
const addLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, municipality, state, locationName } = req.body;
    const fullLocation = `${country}, ${municipality}, ${state}, ${locationName}`;
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
    const fullLocation = `${country} ${state} ${municipality} ${locationName}`;
    try {
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
