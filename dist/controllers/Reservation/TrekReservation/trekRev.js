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
exports.updateTrekRevStatusByBid = exports.updateTrekRevStatusByClient = exports.getTrekRevByBid = exports.getTrekRevByUser = exports.getTrekRev = exports.trekRev = void 0;
const TrekRevModel_1 = __importDefault(require("../../../models/Reservations/TrekReservation/TrekRevModel"));
const setEmail_1 = require("../../../utils/setEmail");
const { customAlphabet } = require("nanoid");
const userModel_1 = __importDefault(require("../../../models/User/userModel"));
const trekking_1 = __importDefault(require("../../../models/Product/trekking"));
const TrekRevLog_1 = __importDefault(require("../../../models/LogModel/TrekRevLog"));
const trekRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "TrR" + bookingId;
    const { passengerName, tickets, email, phone, date, bookedBy } = req.body;
    try {
        const trekData = yield trekking_1.default.findOne({ trekId: id });
        if (!trekData) {
            return res.status(401).json({ error: "Trek Unavailable" });
        }
        const userData = yield userModel_1.default.findOne({ userId: bookedBy });
        if (!userData) {
            return res.status(401).json({ error: "User Not found" });
        }
        // const businessdata = await Business.findOne({ bId: vehData.businessId });
        let trekRev = new TrekRevModel_1.default({
            bookedBy,
            passengerName,
            tickets,
            email,
            phone,
            date,
            businessId: trekData.businessId,
            bookingId,
            trekName: trekData.name,
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
            return res.send(data);
        }
        else {
            return res.json({ message: "NO Trek Reservations " });
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
const updateTrekRevStatusByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email } = req.body;
    try {
        const data = yield TrekRevModel_1.default.findByIdAndUpdate(id, {
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
        let Logs = new TrekRevLog_1.default({
            updatedBy: email,
            status: status,
            bookingId: bookingId,
            time: new Date(),
        });
        Logs = yield Logs.save();
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: email,
            subject: "Booking Status",
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your Booking  ${bookingId} has been updated to ${status}</p>

          </div>
        </div>
      </div> `,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTrekRevStatusByClient = updateTrekRevStatusByClient;
const updateTrekRevStatusByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email, updatedBy } = req.body;
    try {
        const data = yield TrekRevModel_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        let Logs = new TrekRevLog_1.default({
            updatedBy: updatedBy,
            status: status,
            bookingId: bookingId,
            time: new Date(),
        });
        Logs = yield Logs.save();
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: email,
            subject: "Booking Status",
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Booking Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your booking stauts on toursewa is given below.
            </p>
            <p style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Your Booking  ${bookingId} has been updated to ${status}</p>

          </div>
        </div>
      </div> `,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTrekRevStatusByBid = updateTrekRevStatusByBid;
