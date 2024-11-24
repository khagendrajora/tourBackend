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
exports.getAllReservations = exports.updateReservationByBid = exports.getRevByBusinessId = exports.updateReservationStatus = exports.getRevByClientId = exports.vehReservation = void 0;
const vehReserv_1 = __importDefault(require("../../models/Reservations/vehReserv"));
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const ReservedDated_1 = __importDefault(require("../../models/Reservations/ReservedDated"));
const { customAlphabet } = require("nanoid");
const setEmail_1 = require("../../utils/setEmail");
const business_1 = __importDefault(require("../../models/business"));
const vehReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "R" + bookingId;
    const { bookingName, age, email, phone, sourceAddress, destinationAddress, bookingDate, address, bookedBy, bookedByName, numberOfPassengers, } = req.body;
    try {
        const vehData = yield vehicle_1.default.findOne({ vehId: id });
        if (!vehData) {
            return res.status(401).json({ error: "Vehicle Unavailable" });
        }
        const businessdata = yield business_1.default.findOne({ bId: vehData.businessId });
        let vehRev = new vehReserv_1.default({
            vehicleId: vehData.vehId,
            vehicleType: vehData.vehCategory,
            vehicleNumber: vehData.vehNumber,
            capacity: vehData.capacity,
            vehicleName: vehData.name,
            bookingId: bookingId,
            businessId: vehData.businessId,
            vehicleImage: ((_a = vehData.vehImages) === null || _a === void 0 ? void 0 : _a.length) ? vehData.vehImages : [],
            bookedBy,
            bookedByName,
            age,
            sourceAddress,
            destinationAddress,
            email,
            phone,
            bookingDate,
            address,
            bookingName,
            numberOfPassengers,
        });
        vehRev = yield vehRev.save();
        if (!vehRev) {
            return res.status(400).json({ error: "Booking failed" });
        }
        else {
            let resrvDate = new ReservedDated_1.default({
                vehicleId: id,
                bookingDate,
                bookedBy,
                bookingId: bookingId,
            });
            resrvDate = yield resrvDate.save();
            if (!resrvDate) {
                return res.status(400).json({ error: "failed to save date" });
            }
            else {
                yield vehicle_1.default.findByIdAndUpdate(id, {
                    operationDates: bookingDate,
                }, { new: true });
                (0, setEmail_1.sendEmail)({
                    from: "beta.toursewa@gmail.com",
                    to: email,
                    subject: "Booking Confirmation",
                    html: `<h2>Your booking has been successfully Created with Booking Id ${bookingId} </h2>`,
                });
                (0, setEmail_1.sendEmail)({
                    from: "beta.toursewa@gmail.com",
                    to: businessdata === null || businessdata === void 0 ? void 0 : businessdata.primaryEmail,
                    subject: "New Booking",
                    html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${vehData._id}</h2>`,
                });
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
const updateReservationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email } = req.body;
    try {
        const data = yield vehReserv_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        else {
            const revDate = yield ReservedDated_1.default.findOneAndDelete({
                bookingId: bookingId,
            });
            if (!revDate) {
                return res.status(400).json({ error: "failed to Update" });
            }
            (0, setEmail_1.sendEmail)({
                from: "beta.toursewa@gmail.com",
                to: email,
                subject: "Booking Status",
                html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
            });
            return res.status(200).json({ message: status });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateReservationStatus = updateReservationStatus;
const getRevByBusinessId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield vehReserv_1.default.find({ businessId: id });
        if (data.length === 0) {
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
exports.getRevByBusinessId = getRevByBusinessId;
const updateReservationByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, email } = req.body;
    try {
        const data = yield vehReserv_1.default.findOneAndUpdate({ bookingId: id }, { status: status }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to update" });
        }
        else {
            const revDate = yield ReservedDated_1.default.findOneAndDelete({
                bookingId: id,
            });
            if (!revDate) {
                return res.status(400).json({ error: "Failed" });
            }
            (0, setEmail_1.sendEmail)({
                from: "beta.toursewa@gmail.com",
                to: email,
                subject: "Booking Status",
                html: `<h2>Your Booking with booking id ${id} has been ${status}</h2>`,
            });
            return res.status(200).json({ message: status });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateReservationByBid = updateReservationByBid;
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield vehReserv_1.default.find();
        if (data.length > 0) {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllReservations = getAllReservations;
