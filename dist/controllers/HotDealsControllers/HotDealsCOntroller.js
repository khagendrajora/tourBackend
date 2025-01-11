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
exports.deleteHotDeals = exports.updateHotdeals = exports.getHotDealsByVehId = exports.getHotDealsById = exports.getHotDeals = exports.addHotDeals = void 0;
const HotDeals_1 = __importDefault(require("../../models/HotDeals/HotDeals"));
const nanoid_1 = require("nanoid");
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const Driver_1 = __importDefault(require("../../models/Drivers/Driver"));
const business_1 = __importDefault(require("../../models/business"));
const addHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { price, sourceAddress, destAddress, driverId, date, time, termsAndCondition, } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    let hdID = customId();
    hdID = "hd" + hdID;
    try {
        const vehData = yield vehicle_1.default.findOne({ vehId: id });
        if (!vehData) {
            return res.status(400).json({ error: "Vehicle Not found" });
        }
        const businessData = yield business_1.default.findOne({ bId: vehData.businessId });
        if (!businessData) {
            return res.status(400).json({ error: "Business Not found" });
        }
        const driverData = yield Driver_1.default.findOne({ driverId: driverId });
        if (!driverData) {
            return res.status(400).json({ error: "Driver Not found" });
        }
        let data = new HotDeals_1.default({
            price,
            sourceAddress,
            destAddress,
            date,
            time,
            termsAndCondition,
            businessName: businessData.businessName,
            vehicleName: vehData.name,
            vehicleId: id,
            businessId: vehData.businessId,
            driverName: driverData.driverName,
            driverPhone: driverData.driverPhone,
            driverId,
            hdID,
            capacity: vehData.capacity,
        });
        data = yield data.save();
        if (!data) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Added" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addHotDeals = addHotDeals;
const getHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield HotDeals_1.default.find();
        if (!data) {
            return res.status(404).json({ error: "failed" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHotDeals = getHotDeals;
const getHotDealsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let data = yield HotDeals_1.default.find({ hdID: id });
        if (!data) {
            return res.status(404).json({ error: "failed" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHotDealsById = getHotDealsById;
const getHotDealsByVehId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let data = yield HotDeals_1.default.find({ vehicleId: id });
        if (!data) {
            return res.status(404).json({ error: "failed to get hot deal data" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHotDealsByVehId = getHotDealsByVehId;
const updateHotdeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { price, sourceAddress, destAddress, termsAndCondition, vehicle, time } = req.body;
    try {
        const aboutUS = yield HotDeals_1.default.findOneAndUpdate({ hdID: id }, {
            price,
            sourceAddress,
            destAddress,
            vehicle,
            termsAndCondition,
            time,
        }, { new: true });
        if (!aboutUS) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        else {
            return res.status(200).json({ message: "Successfully Updated" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.updateHotdeals = updateHotdeals;
const deleteHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleteHotDeals = yield HotDeals_1.default.findOneAndDelete({ vehicleId: id });
        if (!deleteHotDeals) {
            return res.status(404).json({ error: "Failed" });
        }
        return res.status(200).json({ message: "Successfully Removed" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteHotDeals = deleteHotDeals;
