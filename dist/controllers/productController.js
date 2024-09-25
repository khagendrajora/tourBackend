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
exports.deleteproduct = exports.updateVeh = exports.vehDetails = exports.getVeh = exports.addVehicle = exports.updateTrek = exports.trekDetails = exports.getTrek = exports.addTrek = exports.updateTour = exports.tourDetails = exports.getTour = exports.addTour = void 0;
const tour_1 = __importDefault(require("../models/Product/tour"));
const trekking_1 = __importDefault(require("../models/Product/trekking"));
const vehicle_1 = __importDefault(require("../models/Product/vehicle"));
const addTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prodCategory, prodsubCategory, inclusion, dest, duration, itinerary, capacity, name, phone, operationDates, } = req.body;
    try {
        let tour_images = [];
        if (req.files) {
            const files = req.files;
            if (files["tour_images"]) {
                tour_images = files["tour_images"].map((file) => file.path);
            }
        }
        let tour = new tour_1.default({
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
        if (!tour) {
            return res.status(404).json({ error: "Failed to fetch tour" });
        }
        else {
            return res.send(tour);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTour = getTour;
const tourDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield tour_1.default.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Failed to get Tour" });
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
    const { prodCategory, prodsubCategory, inclusion, dest, duration, itinerary, capacity, name, phone, operationDates, } = req.body;
    try {
        const tour_images = req.body.existingTour_images || [];
        if (req.files) {
            const files = req.files;
            if (files["tour_images"]) {
                const uploadedFiles = files["tour_images"].map((file) => file.path);
                tour_images.push(...uploadedFiles);
            }
        }
        const data = yield tour_1.default.findByIdAndUpdate(id, {
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
    const { prodCategory, prodsubCategory, inclusion, days, dest, numbers, itinerary, capacity, name, operationDates, } = req.body;
    try {
        let trek_images = [];
        if (req.files) {
            const files = req.files;
            if (files["trek_images"]) {
                trek_images = files["trek_images"].map((file) => file.path);
            }
        }
        let trek = new trekking_1.default({
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
        if (!trek) {
            return res.status(404).json({ error: "Failed to fetch tour" });
        }
        else {
            return res.send(trek);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getTrek = getTrek;
const trekDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const trek = yield trekking_1.default.findById(id);
        if (!trek) {
            return res.status(404).json({ error: "Failed to get Tour" });
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
    const { prodCategory, prodsubCategory, inclusion, days, dest, numbers, itinerary, capacity, name, operationDates, } = req.body;
    try {
        const trek_images = req.body.existingTrek_images || [];
        if (req.files) {
            const files = req.files;
            if (files["trek_images"]) {
                const uploadedFiles = files["trek_images"].map((file) => file.path);
                trek_images.push(...uploadedFiles);
            }
        }
        const data = yield trekking_1.default.findByIdAndUpdate(id, {
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
    const { veh_Category, veh_subCategory, services, amenities, veh_condition, madeYear, veh_number, quantity, capacity, name, operationDates, } = req.body;
    try {
        let veh_images = [];
        if (req.files) {
            const files = req.files;
            if (files["veh_images"]) {
                veh_images = files["veh_images"].map((file) => file.path);
            }
        }
        let veh = new vehicle_1.default({
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
        veh = yield veh.save();
        if (!veh) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Vehicle Registered" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addVehicle = addVehicle;
const getVeh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let veh = yield vehicle_1.default.find();
        if (!veh) {
            return res.status(404).json({ error: "Failed to fetch tour" });
        }
        else {
            return res.send(veh);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getVeh = getVeh;
const vehDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield vehicle_1.default.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Failed to get Tour" });
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
    const { veh_Category, veh_subCategory, services, amenities, veh_condition, madeYear, veh_number, quantity, capacity, name, operationDates, } = req.body;
    try {
        let veh_images = req.body.existingVeh_images || [];
        if (req.files) {
            const files = req.files;
            if (files["veh_images"]) {
                const uploadedFiles = files["veh_images"].map((file) => file.path);
                veh_images.push(...uploadedFiles);
            }
        }
        const data = yield vehicle_1.default.findByIdAndUpdate(id, {
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
