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
exports.getRevByClientId = exports.vehReservation = void 0;
const vehReserv_1 = __importDefault(require("../../models/Reservations/vehReserv"));
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const ReservedDated_1 = __importDefault(require("../../models/Reservations/ReservedDated"));
const vehReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { bookingName, age, email, phone, sourceAddress, destinationAddress, bookingDate, address, bookedBy, } = req.body;
    try {
        const vehData = yield vehicle_1.default.findOne({ _id: id });
        if (!vehData) {
            return res.status(401).json({ error: "Vehicle Unavailable" });
        }
        let vehRev = new vehReserv_1.default({
            vehicleId: vehData._id,
            vehicleType: vehData.vehCategory,
            // services: vehData.services,
            // amenities: vehData.amenities,
            vehicleNumber: vehData.vehNumber,
            capacity: vehData.capacity,
            vehicleName: vehData.name,
            bookedBy,
            age,
            sourceAddress,
            destinationAddress,
            email,
            phone,
            bookingDate,
            address,
            bookingName,
        });
        vehRev = yield vehRev.save();
        if (!vehRev) {
            return res.status(400).json({ error: "Booking failed" });
        }
        else {
            let resrvDate = new ReservedDated_1.default({
                vehicleId: vehData._id,
                bookingDate,
                bookedBy,
            });
            resrvDate = yield resrvDate.save();
            if (!resrvDate) {
                return res.status(400).json({ error: "failed to save date" });
            }
            else {
                return res.status(200).json({ message: "Booked" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.vehReservation = vehReservation;
const getRevByClientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield vehReserv_1.default.find({ bookedBy: id });
        if (data.length > 0) {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getRevByClientId = getRevByClientId;
