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
        const userData = yield userModel_1.default.findOne({ userId: bookedBy });
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
            bookingId,
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
            html: `
    <div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%; font-family: Arial, sans-serif;">
  <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
    <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h1 style="font-weight: bold; font-size: 1.25rem; text-align: center; margin: 0;">Booking Status</h1>
      <p style="font-size: 0.875rem; text-align: center; margin: 0;">Your booking status on Toursewa is given below.</p>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left; width: 40%;">Status:</td>
          <td style="font-size: 0.875rem; color: #DC2626; padding: 12px 8px; text-align: left; width: 60%;">Pending</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">BookingID:</td>
          <td style="font-size: 0.875rem; padding: 12px 8px; text-align: left;">${bookingId}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Tour Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${tourData.name}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Passenger Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${passengerName}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Number of Passengers:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${tickets}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Start Date:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${date}</td>
        </tr>
      </table>
    </div>
  </div>
</div>


     `,
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
            return res.send(data);
        }
        else {
            return res.json({ message: "NO Tour Reservations" });
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
            html: `<div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%;">
  <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
    <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h1 style="font-weight: bold; font-size: 1.25rem; text-align: center;">Booking Status</h1>
      <p style="font-size: 0.875rem; text-align: center;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left; width: 40%;">Status:</td>
          <td style="font-size: 0.875rem; color: #DC2626; padding: 12px 8px; text-align: left; width: 60%;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">BookingID:</td>
          <td style="font-size: 0.875rem; padding: 12px 8px; text-align: left;">${bookingId}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Tour Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Passenger Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.passengerName}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Number of Passengers:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.tickets}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Start Date:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.date}</td>
        </tr>
      </table>
    </div>
  </div>
</div>

     `,
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
            html: `<div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%;">
  <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
    <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h1 style="font-weight: bold; font-size: 1.25rem; text-align: center;">Booking Status</h1>
      <p style="font-size: 0.875rem; text-align: center;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left; width: 40%;">Status:</td>
          <td style="font-size: 0.875rem; color: #DC2626; padding: 12px 8px; text-align: left; width: 60%;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">BookingID:</td>
          <td style="font-size: 0.875rem; padding: 12px 8px; text-align: left;">${bookingId}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Tour Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Passenger Name:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.passengerName}</td>
        </tr>
        <tr style="background-color: #F3F4F6;">
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Number of Passengers:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.tickets}</td>
        </tr>
        <tr>
          <td style="font-size: 0.875rem; font-weight: bold; padding: 12px 8px; text-align: left;">Start Date:</td>
          <td style="font-size: 0.875rem; color: #64748B; padding: 12px 8px; text-align: left;">${data.date}</td>
        </tr>
      </table>
    </div>
  </div>
</div>

    `,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateTourRevStatusByBid = updateTourRevStatusByBid;
