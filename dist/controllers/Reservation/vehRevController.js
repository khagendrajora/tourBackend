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
exports.getAllReservations = exports.updateReservationByBid = exports.getRevByVehicleId = exports.getRevByBusinessId = exports.updateReservationStatusByBid = exports.updateReservationStatusByClient = exports.getRevByClientId = exports.vehReservation = void 0;
const vehReserv_1 = __importDefault(require("../../models/Reservations/vehReserv"));
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const ReservedDated_1 = __importDefault(require("../../models/Reservations/ReservedDated"));
const { customAlphabet } = require("nanoid");
const setEmail_1 = require("../../utils/setEmail");
const business_1 = __importDefault(require("../../models/business"));
const VehRevLogs_1 = __importDefault(require("../../models/LogModel/VehRevLogs"));
const vehReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const customId = customAlphabet("1234567890", 4);
    let bookingId = customId();
    bookingId = "R" + bookingId;
    const { bookingName, age, email, phone, sourceAddress, destinationAddress, startDate, endDate, address, bookedBy, bookedByName, numberOfPassengers, } = req.body;
    let bookingDate = [];
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    while (newStartDate <= newEndDate) {
        bookingDate.push(newStartDate.toISOString().split("T")[0]);
        newStartDate.setDate(newStartDate.getDate() + 1);
    }
    try {
        const vehData = yield vehicle_1.default.findOne({ vehId: id });
        if (!vehData) {
            return res.status(401).json({ error: "Vehicle Unavailable" });
        }
        const businessdata = yield business_1.default.findOne({ bId: vehData.businessId });
        let vehRev = new vehReserv_1.default({
            vehicleId: id,
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
            startDate,
            endDate,
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
                // await Vehicle.findOneAndUpdate(
                //   { vehId: id },
                //   {
                //     operationDates: bookingDate,
                //   },
                //   { new: true }
                // );
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
          <strong>From - To:</strong> ${sourceAddress} - ${destinationAddress}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Start Date - End Date:</strong> ${startDate} - ${endDate}
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
                  <h1 style="font-weight: 600;">Vehicle:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Vehicle Number:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleNumber}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.bookingName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.numberOfPassengers}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">From - To:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.sourceAddress} - ${data.destinationAddress}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date - End Date:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.startDate} - ${data.endDate}</h1>
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
                  <h1 style="font-weight: 600;">Vehicle:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Vehicle Number:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleNumber}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.bookingName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.numberOfPassengers}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">From - To:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.sourceAddress} - ${data.destinationAddress}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date - End Date:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.startDate} - ${data.endDate}</h1>
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
exports.updateReservationStatusByBid = updateReservationStatusByBid;
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
const updateReservationByBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, email, updatedBy } = req.body;
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
            let vehLogs = new VehRevLogs_1.default({
                updatedBy: updatedBy,
                status: status,
                bookingId: id,
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
                <span style="font-weight: bold;">BookingID:</span> ${id}
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Vehicle:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Vehicle Number:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.vehicleNumber}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Passenger Name:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.bookingName}</h1>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Number of passengers:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.numberOfPassengers}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">From - To:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.sourceAddress} - ${data.destinationAddress}</h1>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column;">
                  <h1 style="font-weight: 600;">Start Date - End Date:</h1>
                  <h1 style="font-size: 0.875rem; color: #64748B;">${data.startDate} - ${data.endDate}</h1>
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
        else {
            return res.status(400).json({ error: "No Vehicle Revservatrions " });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllReservations = getAllReservations;
