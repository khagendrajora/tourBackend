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
exports.deleteTour = exports.deleteTrek = exports.deleteVehicle = exports.updateVeh = exports.vehDetails = exports.getVehicleByBusinessId = exports.getVeh = exports.addVehicle = exports.updateTrek = exports.trekDetails = exports.getTrekByBusinessId = exports.getTrek = exports.addTrek = exports.updateTour = exports.tourDetails = exports.getTourByBusinessId = exports.getTour = exports.addTour = void 0;
const tour_1 = __importDefault(require("../models/Product/tour"));
const trekking_1 = __importDefault(require("../models/Product/trekking"));
const vehicle_1 = __importDefault(require("../models/Product/vehicle"));
const { customAlphabet } = require("nanoid");
const ProductLogs_1 = __importDefault(require("../models/LogModel/ProductLogs"));
const cloudinary_1 = require("cloudinary");
const business_1 = __importDefault(require("../models/Business/business"));
// import fileUpload, { UploadedFile } from "express-fileupload";
cloudinary_1.v2.config({
    cloud_name: "dwepmpy6w",
    api_key: "934775798563485",
    api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});
// Tour Controller
const addTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let tourId = customId();
    tourId = "TU" + tourId;
    const { businessId, prodCategory, prodsubCategory, inclusion, dest, duration, price, itinerary, capacity, pickUpLocation, name, phone, operationDates, addedBy, } = req.body;
    try {
        const businessData = yield business_1.default.findOne({ businessId });
        if (!businessData) {
            return res.status(404).json({ error: "Business Details not found" });
        }
        if (!req.files || !req.files.tourImages) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.tourImages)
            ? fileArray.tourImages
            : [fileArray.tourImages];
        if (!files) {
            return res.status(400).json({ message: "No image array uploaded" });
        }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "tour",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
        if (!itinerary) {
            return res.status(400).json({ error: "Itinerary is required" });
        }
        let tour = new tour_1.default({
            tourId: tourId,
            businessId,
            businessName: businessData.businessName,
            prodCategory,
            prodsubCategory,
            inclusion,
            dest,
            price,
            addedBy,
            duration,
            pickUpLocation,
            itinerary,
            capacity,
            name,
            phone,
            operationDates,
            tourImages: uploadedImages,
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
    const { businessId, prodCategory, prodsubCategory, inclusion, dest, duration, pickUpLocation, itinerary, capacity, price, name, phone, updatedBy, operationDates, } = req.body;
    try {
        let existingTourImages = req.body.existingTourImages || [];
        let tourImages = existingTourImages || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["tourImages"]) {
        //     const uploadedFiles = files["tourImages"].map((file) => file.path);
        //     tourImages.push(...uploadedFiles);
        //   }
        // }
        if (req.files && req.files.tourImages) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.tourImages)
                ? fileArray.tourImages
                : [fileArray.tourImages];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "tour",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            tourImages.push(...uploadedImages);
        }
        const data = yield tour_1.default.findOneAndUpdate({ tourId: id }, {
            prodCategory,
            prodsubCategory,
            inclusion,
            dest,
            duration,
            itinerary,
            pickUpLocation,
            capacity,
            price,
            name,
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
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Updated",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "success", data });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTour = updateTour;
// Trek controller
const addTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let trekId = customId();
    trekId = "TR" + trekId;
    const { businessId, prodCategory, prodsubCategory, inclusion, days, dest, pickUpLocation, price, numbers, itinerary, capacity, addedBy, name, operationDates, } = req.body;
    try {
        const businessData = yield business_1.default.findOne({ businessId });
        if (!businessData) {
            return res.status(404).json({ error: "Business Details not found" });
        }
        // let trekImages: string[] = [];
        if (!req.files || !req.files.trekImages) {
            return res.status(400).json({ error: "No Image uploaded" });
        }
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["trekImages"]) {
        //     trekImages = files["trekImages"].map((file) => file.path);
        //   }
        // }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.trekImages)
            ? fileArray.trekImages
            : [fileArray.tourImages];
        if (!files) {
            return res.status(400).json({ error: "No images Array found" });
        }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "trek",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
        if (!uploadedImages) {
            return res
                .status(400)
                .json({ error: "Failed to save images in Cloudinary" });
        }
        if (!itinerary) {
            return res.status(400).json({ error: "Itinerary is required" });
        }
        let trek = new trekking_1.default({
            businessId,
            prodCategory,
            prodsubCategory,
            businessName: businessData.businessName,
            inclusion,
            days,
            addedBy,
            pickUpLocation,
            dest,
            price,
            trekId: trekId,
            numbers,
            itinerary,
            capacity,
            name,
            operationDates,
            trekImages: uploadedImages,
        });
        trek = yield trek.save();
        if (!trek) {
            return res.status(400).json({ error: "Failed" });
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
    const { businessId, prodCategory, prodsubCategory, inclusion, days, dest, price, pickUpLocation, numbers, updatedBy, itinerary, capacity, name, operationDates, } = req.body;
    try {
        // const trekImages: string[] = req.body.existingTrekImages || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["trekImages"]) {
        //     const uploadedFiles = files["trekImages"].map((file) => file.path);
        //     trekImages.push(...uploadedFiles);
        //   }
        // }
        let existingTrekImages = req.body.existingTrekImages || [];
        let trekImages = existingTrekImages || [];
        if (req.files && req.files.trekImages) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.trekImages)
                ? fileArray.trekImages
                : [fileArray.trekImages];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "trek",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            trekImages.push(...uploadedImages);
        }
        const data = yield trekking_1.default.findOneAndUpdate({ trekId: id }, {
            businessId,
            prodCategory,
            prodsubCategory,
            inclusion,
            days,
            dest,
            numbers,
            pickUpLocation,
            price,
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
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Updated",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTrek = updateTrek;
// Vehicle Controller
const addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let vehicleId = customId();
    vehicleId = "V" + vehicleId;
    const { businessId, vehCategory, vehSubCategory, services, baseLocation, addedBy, amenities, vehCondition, price, description, madeYear, vehNumber, capacity, name, operationDates, manufacturer, model, VIN, } = req.body;
    try {
        // let vehImages: string[] = [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["vehImages"]) {
        //     vehImages = files["vehImages"].map((file) => file.path);
        //   }
        // }
        const businessData = yield business_1.default.findOne({ businessId });
        if (!businessData) {
            return res.status(404).json({ error: "Business Details not found" });
        }
        if (!req.files || !req.files.vehImages) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.vehImages)
            ? fileArray.vehImages
            : [fileArray.vehImages];
        if (!files) {
            return res.status(400).json({ message: "No image array uploaded" });
        }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "Vehicle",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
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
            vehicleId: vehicleId,
            addedBy,
            price,
            description,
            amenities,
            vehCondition,
            madeYear,
            vehNumber,
            baseLocation,
            businessName: businessData.businessName,
            capacity,
            name,
            operationDates,
            vehImages: uploadedImages,
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
        const data = yield vehicle_1.default.findOne({ vehicleId: id });
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
    const { businessId, vehCategory, vehSubCategory, services, amenities, baseLocation, vehCondition, price, description, madeYear, updatedBy, vehNumber, capacity, name, operationDates, } = req.body;
    try {
        // let vehImages: string[] = req.body.existingVehImages || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["vehImages"]) {
        //     const uploadedFiles = files["vehImages"].map((file) => file.path);
        //     vehImages.push(...uploadedFiles);
        //   }
        // }
        let existingVehImages = req.body.existingVehImages || [];
        let vehImages = existingVehImages || [];
        if (req.files && req.files.vehImages) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.vehImages)
                ? fileArray.vehImages
                : [fileArray.vehImages];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "Vehicle",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            vehImages.push(...uploadedImages);
        }
        const vehData = yield vehicle_1.default.findOne({ vehicleId: id });
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
        const data = yield vehicle_1.default.findOneAndUpdate({ vehicleId: id }, updateData, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Updated",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateVeh = updateVeh;
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        const veh = yield vehicle_1.default.findByIdAndDelete(id);
        if (!veh) {
            return res.status(400).json({ error: "Not found" });
        }
        else {
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: veh.vehicleId,
                action: "Deleted",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "Vehicle Deleted" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.deleteVehicle = deleteVehicle;
const deleteTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        const trek = yield trekking_1.default.findByIdAndDelete(id);
        if (!trek) {
            return res.status(400).json({ error: "Not found" });
        }
        else {
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: trek.trekId,
                action: "Deleted",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "Trek Deleted" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.deleteTrek = deleteTrek;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        const tour = yield tour_1.default.findByIdAndDelete(id);
        if (!tour) {
            return res.status(400).json({ error: "Not found" });
        }
        else {
            let productLog = new ProductLogs_1.default({
                updatedBy: updatedBy,
                productId: tour.tourId,
                action: "Deleted",
                time: new Date(),
            });
            productLog = yield productLog.save();
            return res.status(200).json({ message: "Tour Deleted" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.deleteTour = deleteTour;
