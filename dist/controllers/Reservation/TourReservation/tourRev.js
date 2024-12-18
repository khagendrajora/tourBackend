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
exports.updateTourRevStatusByBid = exports.updateTourRevStatusByClient = exports.getTourRevByBid = exports.getTourRevByUser = exports.getTourRev = exports.tourRev = void 0;
const tourRevModel_1 = __importDefault(require("../../../models/Reservations/TourReservation/tourRevModel"));
const setEmail_1 = require("../../../utils/setEmail");
const { customAlphabet } = require("nanoid");
const tour_1 = __importDefault(require("../../../models/Product/tour"));
const TourRevLog_1 = __importDefault(require("../../../models/LogModel/TourRevLog"));
const userModel_1 = __importDefault(require("../../../models/User/userModel"));
const tourRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "TuR" + bookingId;
    const { passengerName, tickets, email, phone, date, bookedBy } = req.body;
    try {
        const tourData = yield tour_1.default.findOne({ tourId: id });
        if (!tourData) {
            return res.status(401).json({ error: "Tour Unavailable" });
        }
        const userData = yield userModel_1.default.findById({ bookedBy });
        if (!userData) {
            return res.status(401).json({ error: "User Not found" });
        }
        // const businessdata = await Business.findOne({ bId: vehData.businessId });
        let tourRev = new tourRevModel_1.default({
            bookedBy: userData.userId,
            passengerName,
            tickets,
            email,
            phone,
            date,
            businessId: tourData.businessId,
            bookingId: bookingId,
            tourId: id,
            tourName: tourData.name,
        });
        tourRev = yield tourRev.save();
        if (!tourRev) {
            return res.status(400).json({ error: "Booking failed" });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: email,
            subject: "Booking Confirmation",
            html: `<h2>Your booking has been successfully Created with Booking Id ${bookingId} </h2>`,
        });
        // sendEmail({
        //   from: "beta.toursewa@gmail.com",
        //   to: businessdata?.primaryEmail,
        //   subject: "New Booking",
        //   html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
        // });
        return res.status(200).json({ message: "Successfully Send" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.tourRev = tourRev;
const getTourRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield tourRevModel_1.default.find();
        if (data.length > 0) {
            return res.send();
        }
        else {
            return res.json({ message: "NO Reservations Present" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getTourRev = getTourRev;
const getTourRevByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield tourRevModel_1.default.find({ bookedBy: id });
        if (data.length > 0) {
            return res.send(data);
        }
        else {
            return res.json({ message: "No Bookings Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getTourRevByUser = getTourRevByUser;
const getTourRevByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield tourRevModel_1.default.find({ businessId: id });
        if (data.length === 0) {
            return res.json({ message: "No Bookings Found" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getTourRevByBid = getTourRevByBid;
const updateTourRevStatusByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email } = req.body;
    try {
        const data = yield tourRevModel_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        // const revDate = await ReservedDate.findOneAndDelete({
        //   bookingId: bookingId,
        // });
        // if (!revDate) {
        //   return res.status(400).json({ error: "failed to Update" });
        // }
        let vehLogs = new TourRevLog_1.default({
            updatedBy: email,
            status: status,
            bookingId: bookingId,
            time: new Date(),
        });
        vehLogs = yield vehLogs.save();
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: email,
            subject: "Booking Status",
            html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTourRevStatusByClient = updateTourRevStatusByClient;
const updateTourRevStatusByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email, updatedBy } = req.body;
    try {
        const data = yield tourRevModel_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        let vehLogs = new TourRevLog_1.default({
            updatedBy: updatedBy,
            status: status,
            bookingId: bookingId,
            time: new Date(),
        });
        vehLogs = yield vehLogs.save();
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: email,
            subject: "Booking Status",
            html: `<h2>Your Booking with booking id ${bookingId} has been ${status}</h2>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTourRevStatusByBid = updateTourRevStatusByBid;
