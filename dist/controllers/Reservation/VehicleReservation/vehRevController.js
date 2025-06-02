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
exports.removeDriver = exports.assignDriver = exports.getRevByVehicleId = exports.getRevByBusinessId = exports.getAllReservations = exports.updateReservationStatusByBid = exports.updateReservationStatusByClient = exports.getRevByClientId = exports.vehReservation = void 0;
const vehReserv_1 = __importDefault(require("../../../models/Reservations/VehicleReservation/vehReserv"));
const vehicle_1 = __importDefault(require("../../../models/Product/vehicle"));
const ReservedDated_1 = __importDefault(require("../../../models/Reservations/VehicleReservation/ReservedDated"));
const nanoid_1 = require("nanoid");
const setEmail_1 = require("../../../utils/setEmail");
const business_1 = __importDefault(require("../../../models/Business/business"));
const VehRevLogs_1 = __importDefault(require("../../../models/LogModel/VehRevLogs"));
const Driver_1 = __importDefault(require("../../../models/Business/Driver"));
const vehReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    let bookingId = customId();
    bookingId = "R" + bookingId;
    const { bookingName, email, phone, totalPrice, pickUpLocation, dropOffLocation, pickUpDate, dropOffDate, address, bookedBy, numberOfPassengers, } = req.body;
    let bookingDate = [];
    const newPickUpDate = pickUpDate;
    const newDropOffDate = dropOffDate;
    let current = new Date(newPickUpDate);
    while (current <= new Date(newDropOffDate)) {
        bookingDate.push(current.toDateString());
        current.setDate(current.getDate() + 1);
    }
    try {
        const vehData = yield vehicle_1.default.findOne({ vehicleId: id });
        if (!vehData) {
            return res.status(401).json({ error: "Vehicle Unavailable" });
        }
        const businessdata = yield business_1.default.findOne({
            businessId: vehData.businessId,
        });
        let vehRev = new vehReserv_1.default({
            vehicleId: id,
            vehicleType: vehData.vehCategory,
            vehicleNumber: vehData.vehNumber,
            vehicleName: vehData.name,
            bookingId: bookingId,
            businessId: vehData.businessId,
            businessName: vehData.businessName,
            businessPhone: businessdata === null || businessdata === void 0 ? void 0 : businessdata.primaryPhone,
            vehicleImage: ((_a = vehData.vehImages) === null || _a === void 0 ? void 0 : _a.length) ? vehData.vehImages : [],
            bookedBy,
            totalPrice,
            pickUpLocation,
            dropOffLocation,
            email,
            phone,
            pickUpDate,
            dropOffDate,
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
                time: new Date(),
            });
            resrvDate = yield resrvDate.save();
            if (!resrvDate) {
                return res.status(400).json({ error: "failed to save date" });
            }
            else {
                (0, setEmail_1.sendEmail)({
                    from: "beta.toursewa@gmail.com",
                    to: email,
                    subject: "Booking Confirmation",
                    html: `
           <div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 100px;">
    </div>
    <h1 style="font-size: 18px; font-weight: bold; text-align: left;">Booking Status</h1>
    <p style="font-size: 14px; text-align: left;">Your booking status on Toursewa is given below.</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Status:</strong> <span style="color: #DC2626;">Pending</span>
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>BookingID:</strong> ${bookingId}
        </td>
      </tr>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Vehicle:</strong> ${vehData.name}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Vehicle Number:</strong> ${vehData.vehNumber}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Passenger Name:</strong> ${bookingName}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Number of Passengers:</strong> ${numberOfPassengers}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>From - To:</strong> ${pickUpLocation} - ${dropOffLocation}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${totalPrice}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Start Date - End Date:</strong> ${pickUpDate} - ${dropOffDate}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>For Enquiry:</strong> ${businessdata === null || businessdata === void 0 ? void 0 : businessdata.primaryPhone}
        </td>
      </tr>
    </table>
  </div>`,
                });
                (0, setEmail_1.sendEmail)({
                    from: "beta.toursewa@gmail.com",
                    to: businessdata === null || businessdata === void 0 ? void 0 : businessdata.primaryEmail,
                    subject: "New Booking",
                    html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
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
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getRevByClientId = getRevByClientId;
const updateReservationStatusByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email } = req.body;
    try {
        const data = yield vehReserv_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        const revDate = yield ReservedDated_1.default.findOneAndDelete({
            bookingId: bookingId,
        });
        if (!revDate) {
            return res.status(400).json({ error: "failed to Update" });
        }
        let vehLogs = new VehRevLogs_1.default({
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
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Status:</td>
          <td style="font-size: 14px; color: #DC2626;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">BookingID:</td>
          <td style="font-size: 14px;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B;">${data.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B;">${data.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B;">${data.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B;">${data.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">From - To:</td>
          <td style="font-size: 14px; color: #64748B;">${data.pickUpLocation} - ${data.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${data.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B;">${data.pickUpDate} - ${data.dropOffDate}</td>
        </tr>
      </table>
    </div>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateReservationStatusByClient = updateReservationStatusByClient;
const updateReservationStatusByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, bookingId, email, updatedBy } = req.body;
    try {
        const data = yield vehReserv_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Failed to Update" });
        }
        let vehLogs = new VehRevLogs_1.default({
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
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.pickUpLocation} - ${data.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${data.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.pickUpDate} - ${data.dropOffDate}</td>
        </tr>
      </table>
    </div>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateReservationStatusByBid = updateReservationStatusByBid;
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield vehReserv_1.default.find();
        if (data.length > 0) {
            return res.send(data);
        }
        else {
            return res.status(400).json({ error: "No Vehicle Revservatrions " });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllReservations = getAllReservations;
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
const getRevByVehicleId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield vehReserv_1.default.find({ vehicleId: id });
        if (data.length === 0) {
            return res.status(404).json({ error: "No Reservations found" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getRevByVehicleId = getRevByVehicleId;
const assignDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { bookingId, updatedBy } = req.body;
    try {
        const driver = yield Driver_1.default.findOne({ driverId: id });
        if (!driver) {
            return res.status(401).json({ error: "Driver Not Found" });
        }
        const booking = yield vehReserv_1.default.findOne({ bookingId });
        if (!booking) {
            return res.status(401).json({ error: "Reservation Not Found" });
        }
        const revDates = yield ReservedDated_1.default.findOne({ bookingId });
        if (!revDates) {
            return res.status(401).json({ error: "Reservation Dates Not Found" });
        }
        const updateBooking = yield vehReserv_1.default.findOneAndUpdate({ bookingId: bookingId }, {
            driver: driver.name,
            driverPhone: driver.phone,
            driverId: driver.driverId,
        }, { new: true });
        if (!updateBooking) {
            return res.status(401).json({ error: "Failed To Assign" });
        }
        const updateDriver = yield Driver_1.default.findOneAndUpdate({ driverId: id }, {
            $addToSet: {
                operationalDate: { $each: revDates.bookingDate },
                bookingId: { $each: [booking._id] },
            },
        }, { new: true });
        if (!updateDriver) {
            return res.status(401).json({ error: "Failed To update Driver" });
        }
        let vehLogs = new VehRevLogs_1.default({
            updatedBy: updatedBy,
            status: `Assigned to the reservation ${bookingId}`,
            bookingId: bookingId,
            time: new Date(),
        });
        vehLogs = yield vehLogs.save();
        if (!vehLogs) {
            return res.status(400).json({ error: "Failed to save the logs" });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: booking.email,
            subject: "Assigned Driver For Your Booking",
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${booking.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpLocation} - ${booking.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${booking.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpDate} - ${booking.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.name}</td>
        </tr>
           <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.phone}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.driverId}</td>
        </tr>
      </table>
    </div>`,
        });
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driver.email,
            subject: "New Booking Alert",
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${booking.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpLocation} - ${booking.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${booking.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpDate} - ${booking.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.name}</td>
        </tr>
           <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.phone}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.driverId}</td>
        </tr>
      </table>
    </div>`,
        });
        return res.status(200).json({ message: "Driver Assigned" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.assignDriver = assignDriver;
const removeDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.body;
    try {
        const revData = yield vehReserv_1.default.findOne({ bookingId: id });
        if (!revData) {
            return res.status(404).json({ error: "Not Found1" });
        }
        const revDates = yield ReservedDated_1.default.findOne({ bookingId: id });
        if (!revDates) {
            return res.status(404).json({ error: "Not Found2" });
        }
        const driver = yield Driver_1.default.findOne({ driverId: revData.driverId });
        if (!driver) {
            return res.status(404).json({ error: "Not Found3" });
        }
        const updateDriver = yield Driver_1.default.findOneAndUpdate({ driverId: driver.driverId }, {
            $pull: {
                bookingId: revData._id,
                operationalDate: { $in: revDates.bookingDate },
            },
        }, { new: true });
        if (!updateDriver) {
            return res.status(404).json({ error: "Failed" });
        }
        const updateReservation = yield vehReserv_1.default.updateOne({ bookingId: id }, {
            $unset: {
                driver: "",
                driverPhone: "",
            },
        });
        if (!updateReservation) {
            return res.status(404).json({ error: "Failed" });
        }
        let vehLogs = new VehRevLogs_1.default({
            updatedBy: updatedBy,
            status: `Removed Driver`,
            bookingId: id,
            time: new Date(),
        });
        vehLogs = yield vehLogs.save();
        if (!vehLogs) {
            return res.status(400).json({ error: "Failed to save the logs" });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: revData.email,
            subject: "Driver Remove alert",
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${revData.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${revData.bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpLocation} - ${revData.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${revData.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpDate} - ${revData.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Removed</td>
        </tr>
      </table>
    </div>`,
        });
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driver.email,
            subject: "Alert Removed From the booking",
            html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${revData.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${revData.bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpLocation} - ${revData.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${revData.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpDate} - ${revData.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">${driver.name} has been removed from the booking ${revData.bookingId}</td>
        
      
      </table>
    </div>`,
        });
        return res.status(200).json({
            message: "Driver removed from reservation",
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.removeDriver = removeDriver;
