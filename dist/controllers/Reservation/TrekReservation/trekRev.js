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
exports.getTrekRevByBid = exports.getTrekRevByUser = exports.getTrekRev = exports.trekRev = void 0;
const TrekRevModel_1 = __importDefault(require("../../../models/Reservations/TrekReservation/TrekRevModel"));
const setEmail_1 = require("../../../utils/setEmail");
const { customAlphabet } = require("nanoid");
const trekking_1 = __importDefault(require("../../../models/Product/trekking"));
const trekRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "TrR" + bookingId;
    const { passengerName, tickets, email, phone, from } = req.body;
    try {
        const trekData = yield trekking_1.default.findOne({ trekId: id });
        if (!trekData) {
            return res.status(401).json({ error: "Trek Unavailable" });
        }
        // const businessdata = await Business.findOne({ bId: vehData.businessId });
        let trekRev = new TrekRevModel_1.default({
            passengerName,
            tickets,
            email,
            phone,
            from,
            businessId: trekData.businessId,
            bookingId: bookingId,
            trekId: id,
        });
        trekRev = yield trekRev.save();
        if (!trekRev) {
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
exports.trekRev = trekRev;
const getTrekRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield TrekRevModel_1.default.find();
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
exports.getTrekRev = getTrekRev;
const getTrekRevByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield TrekRevModel_1.default.find({ bookedBy: id });
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
exports.getTrekRevByUser = getTrekRevByUser;
const getTrekRevByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield TrekRevModel_1.default.find({ businessId: id });
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
exports.getTrekRevByBid = getTrekRevByBid;
