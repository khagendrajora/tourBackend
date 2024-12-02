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
exports.tourRev = void 0;
const tourRevModel_1 = __importDefault(require("../../../models/Reservations/TourReservation/tourRevModel"));
const setEmail_1 = require("../../../utils/setEmail");
const { customAlphabet } = require("nanoid");
const tour_1 = __importDefault(require("../../../models/Product/tour"));
const tourRev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "TR" + bookingId;
    const { name, tickets, email, phone, from, end } = req.body;
    try {
        const tourData = yield tour_1.default.findOne({ tourId: id });
        if (!tourData) {
            return res.status(401).json({ error: "Tour Unavailable" });
        }
        // const businessdata = await Business.findOne({ bId: vehData.businessId });
        let tourRev = new tourRevModel_1.default({
            name,
            tickets,
            email,
            phone,
            from,
            end,
            bookingId: bookingId,
            tourId: id,
        });
        tourRev = yield tourRev.save();
        if (!tourRev) {
            return res.status(400).json({ error: "Booking failed" });
        }
        //  else {
        //   let resrvDate = new ReservedDate({
        //     vehicleId: id,
        //     bookingDate,
        //     bookedBy,
        //     bookingId: bookingId,
        //   });
        //   resrvDate = await resrvDate.save();
        //   if (!resrvDate) {
        //     return res.status(400).json({ error: "failed to save date" });
        //   } else {
        //     await Vehicle.findOneAndUpdate(
        //       { vehId: id },
        //       {
        //         operationDates: bookingDate,
        //       },
        //       { new: true }
        //     );
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
