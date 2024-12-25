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
            html: ` <div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%;">
      <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
        <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
          <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h1 style="font-weight: bold; font-size: 1.25rem;">Booking Status</h1>
          <p>Your booking status on toursewa is given below.</p>
          <div style="border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; display: flex; flex-direction: column; padding: 20px; gap: 20px;">
            <div style="display: flex; gap: 32px;">
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">Status:</span> <span style="color: #DC2626;">Pending</span>
              </p>
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">BookingID:</span> ${bookingId}
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Trek Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${trekData.name}</h1>
                </div>
              
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${passengerName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${tickets}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
             
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date :</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${date}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
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
            html: `<div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%;">
      <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
        <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
          <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h1 style="font-weight: bold; font-size: 1.25rem;">Booking Status</h1>
          <p>Your booking status on toursewa is given below.</p>
          <div style="border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; display: flex; flex-direction: column; padding: 20px; gap: 20px;">
            <div style="display: flex; gap: 32px;">
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">Status:</span> <span style="color: #DC2626;">${status}</span>
              </p>
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">BookingID:</span> ${bookingId}
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Trek Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.trekName}</h1>
                </div>
               
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.passengerName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.tickets}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
             
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date :</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.date} </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
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
            html: `<div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; max-width: 90%;">
      <div style="display: flex; flex-direction: column; width: 75%; gap: 20px;">
        <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
          <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h1 style="font-weight: bold; font-size: 1.25rem;">Booking Status</h1>
          <p>Your booking status on toursewa is given below.</p>
          <div style="border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; display: flex; flex-direction: column; padding: 20px; gap: 20px;">
            <div style="display: flex; gap: 32px;">
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">Status:</span> <span style="color: #DC2626;">${status}</span>
              </p>
              <p style="font-size: 0.875rem;">
                <span style="font-weight: bold;">BookingID:</span> ${bookingId}
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Trek:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.trekName}</h1>
                </div>
               
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.passengerName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.tickets}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
             
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date :</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.date} </h1>
                </div>
              </div>
            </div>
          </div>
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
