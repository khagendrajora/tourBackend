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
exports.deleteproduct = exports.updateVeh = exports.vehDetails = exports.getVehicleByBusinessId = exports.getVeh = exports.addVehicle = exports.updateTrek = exports.trekDetails = exports.getTrekByBusinessId = exports.getTrek = exports.addTrek = exports.updateTour = exports.tourDetails = exports.getTourByBusinessId = exports.getTour = exports.addTour = void 0;
const tour_1 = __importDefault(require("../models/Product/tour"));
const trekking_1 = __importDefault(require("../models/Product/trekking"));
const vehicle_1 = __importDefault(require("../models/Product/vehicle"));
const { customAlphabet } = require("nanoid");
// import ReservedDate from "../models/Reservations/ReservedDated";
const addTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let tourId = customId();
    tourId = "TU" + tourId;
    const { businessId, prodCategory, prodsubCategory, inclusion, dest, duration, itinerary, capacity, name, phone, operationDates, addedBy, } = req.body;
    try {
        let tourImages = [];
        if (req.files) {
            const files = req.files;
            if (files["tourImages"]) {
                tourImages = files["tourImages"].map((file) => file.path);
            }
        }
        if (!itinerary) {
            return res.status(400).json({ error: "Itinerary is required" });
        }
        let tour = new tour_1.default({
            tourId: tourId,
            businessId,
            prodCategory,
            prodsubCategory,
            inclusion,
            dest,
            addedBy,
            duration,
            itinerary,
            capacity,
            name,
            phone,
            operationDates,
            tourImages,
        });
        tour = yield tour.save();
        if (!tour) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Tour Registered" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addTour = addTour;
const getTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tour = yield tour_1.default.find();
        if (tour.length > 0) {
            return res.send(tour);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTour = getTour;
const getTourByBusinessId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessid;
    try {
        let tour = yield tour_1.default.find({ businessId: id });
        if (tour.length > 0) {
            return res.send(tour);
        }
        else {
            return res.status(404).json({ error: "No Data found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTourByBusinessId = getTourByBusinessId;
const tourDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield tour_1.default.findOne({ tourId: id });
        if (!data) {
            return res.status(404).json({ error: "No Data found" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.tourDetails = tourDetails;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { businessId, prodCategory, prodsubCategory, inclusion, dest, duration, itinerary, capacity, name, phone, addedBy, operationDates, } = req.body;
    try {
        const tourImages = req.body.existingTourImages || [];
        if (req.files) {
            const files = req.files;
            if (files["tourImages"]) {
                const uploadedFiles = files["tourImages"].map((file) => file.path);
                tourImages.push(...uploadedFiles);
            }
        }
        const data = yield tour_1.default.findOneAndUpdate({ tourId: id }, {
            businessId,
            prodCategory,
            prodsubCategory,
            inclusion,
            dest,
            duration,
            itinerary,
            capacity,
            name,
            addedBy,
            phone,
            operationDates,
            tourImages,
        }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTour = updateTour;
const addTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let trekId = customId();
    trekId = "TR" + trekId;
    const { businessId, prodCategory, prodsubCategory, inclusion, days, dest, numbers, itinerary, capacity, addedBy, name, operationDates, } = req.body;
    try {
        let trekImages = [];
        if (req.files) {
            const files = req.files;
            if (files["trekImages"]) {
                trekImages = files["trekImages"].map((file) => file.path);
            }
        }
        if (!itinerary) {
            return res.status(400).json({ error: "Itinerary is required" });
        }
        let trek = new trekking_1.default({
            businessId,
            prodCategory,
            prodsubCategory,
            inclusion,
            days,
            addedBy,
            dest,
            trekId: trekId,
            numbers,
            itinerary,
            capacity,
            name,
            operationDates,
            trekImages,
        });
        trek = yield trek.save();
        if (!trek) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Trek Registered" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addTrek = addTrek;
const getTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let trek = yield trekking_1.default.find();
        if (trek.length > 0) {
            return res.send(trek);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTrek = getTrek;
const getTrekByBusinessId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessid;
    try {
        let trek = yield trekking_1.default.find({ businessId: id });
        if (trek.length > 0) {
            return res.send(trek);
        }
        else {
            return res.status(404).json({ error: "No Data Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTrekByBusinessId = getTrekByBusinessId;
const trekDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const trek = yield trekking_1.default.findOne({ trekId: id });
        if (!trek) {
            return res.status(404).json({ error: "Failed to get Trek" });
        }
        else {
            return res.send(trek);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.trekDetails = trekDetails;
const updateTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { businessId, prodCategory, prodsubCategory, inclusion, days, dest, numbers, addedBy, itinerary, capacity, name, operationDates, } = req.body;
    try {
        const trekImages = req.body.existingTrekImages || [];
        if (req.files) {
            const files = req.files;
            if (files["trekImages"]) {
                const uploadedFiles = files["trekImages"].map((file) => file.path);
                trekImages.push(...uploadedFiles);
            }
        }
        const data = yield trekking_1.default.findOneAndUpdate({ trekId: id }, {
            businessId,
            prodCategory,
            prodsubCategory,
            inclusion,
            days,
            dest,
            addedBy,
            numbers,
            itinerary,
            capacity,
            name,
            operationDates,
            trekImages,
        }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTrek = updateTrek;
const addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let vehId = customId();
    vehId = "V" + vehId;
    const { businessId, vehCategory, vehSubCategory, services, baseLocation, addedBy, amenities, vehCondition, description, madeYear, vehNumber, businessName, capacity, name, operationDates, manufacturer, model, VIN, } = req.body;
    try {
        let vehImages = [];
        if (req.files) {
            const files = req.files;
            if (files["vehImages"]) {
                vehImages = files["vehImages"].map((file) => file.path);
            }
        }
        const vehicleNumber = yield vehicle_1.default.findOne({
            vehNumber: vehNumber,
        });
        if (vehicleNumber) {
            return res
                .status(400)
                .json({ error: "Vehicle Number already registered" });
        }
        const vehicleVIN = yield vehicle_1.default.findOne({ VIN: VIN });
        if (vehicleVIN) {
            return res.status(400).json({ error: "VIN Number already registered" });
        }
        let veh = new vehicle_1.default({
            businessId,
            vehCategory,
            vehSubCategory,
            services,
            vehId: vehId,
            addedBy,
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
        veh = yield veh.save();
        if (!veh) {
            return res.status(400).json({ error: "failed to save" });
        }
        return res.status(200).json({ message: "Vehicle Registered" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addVehicle = addVehicle;
const getVeh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let veh = yield vehicle_1.default.find();
        if (veh.length > 0) {
            return res.send(veh);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getVeh = getVeh;
const getVehicleByBusinessId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessid;
    try {
        let veh = yield vehicle_1.default.find({ businessId: id });
        if (veh.length > 0) {
            return res.send(veh);
        }
        else {
            return res.status(400).json({ error: "No Data Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getVehicleByBusinessId = getVehicleByBusinessId;
const vehDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield vehicle_1.default.findOne({ vehId: id });
        if (!data) {
            return res.status(404).json({ error: "Failed" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.vehDetails = vehDetails;
const updateVeh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { businessId, vehCategory, vehSubCategory, services, amenities, baseLocation, vehCondition, description, madeYear, addedBy, vehNumber, capacity, name, operationDates, } = req.body;
    try {
        let vehImages = req.body.existingVehImages || [];
        if (req.files) {
            const files = req.files;
            if (files["vehImages"]) {
                const uploadedFiles = files["vehImages"].map((file) => file.path);
                vehImages.push(...uploadedFiles);
            }
        }
        const vehData = yield vehicle_1.default.findOne({ vehId: id });
        if (!vehData) {
            return res.status(400).json({ error: "Vehicle Not Found" });
        }
        const numberCheck = yield vehicle_1.default.findOne({
            vehNumber: { $ne: vehData.vehNumber },
            $or: [{ vehNumber: vehNumber }],
        });
        if (numberCheck) {
            return res
                .status(400)
                .json({ error: "Vehicle Number already Registered" });
        }
        const updateData = {
            businessId,
            vehCategory,
            vehSubCategory,
            services,
            amenities,
            description,
            vehCondition,
            madeYear,
            addedBy,
            vehNumber,
            baseLocation,
            capacity,
            name,
            vehImages,
        };
        if (services !== undefined) {
            if (Array.isArray(services) && services.length === 0) {
                updateData.services = [];
            }
            else {
                updateData.services = services;
            }
        }
        else {
            updateData.services = [];
        }
        if (amenities !== undefined) {
            if (Array.isArray(amenities) && amenities.length === 0) {
                updateData.amenities = [];
            }
            else {
                updateData.amenities = amenities;
            }
        }
        else {
            updateData.amenities = [];
        }
        if (operationDates !== undefined) {
            if (Array.isArray(operationDates) && operationDates.length === 0) {
                updateData.operationDates = [];
            }
            else {
                updateData.operationDates = operationDates;
            }
        }
        else {
            updateData.operationDates = [];
        }
        const data = yield vehicle_1.default.findOneAndUpdate({ vehId: id }, updateData, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateVeh = updateVeh;
const deleteproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const tour = yield tour_1.default.findByIdAndDelete(id);
        if (!tour) {
            const trek = yield trekking_1.default.findByIdAndDelete(id);
            if (!trek) {
                const veh = yield vehicle_1.default.findByIdAndDelete(id);
                if (!veh) {
                    return res.status(400).json({ error: "Not found" });
                }
                else {
                    return res.status(200).json({ message: "Vehicle Deleted" });
                }
            }
            else {
                return res.status(200).json({ message: "Trek Deleted" });
            }
        }
        else {
            return res.status(200).json({ message: "Tour Deleted" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.deleteproduct = deleteproduct;
