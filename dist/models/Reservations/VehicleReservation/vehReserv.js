"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var IStatus;
(function (IStatus) {
    IStatus["Approved"] = "Approved";
    IStatus["Canceled"] = "Canceled";
    IStatus["Fulfilled"] = "Fulfilled";
    IStatus["Pending"] = "Pending";
})(IStatus || (exports.IStatus = IStatus = {}));
const VehicleReservation = new mongoose_1.default.Schema({
    vehicleId: {
        type: String,
        required: true,
    },
    businessPhone: {
        type: String,
    },
    pickUpDate: {
        type: String,
        required: true,
    },
    dropOffDate: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    numberOfPassengers: {
        type: Number,
        required: true,
    },
    businessId: {
        type: String,
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    pickUpLocation: {
        type: String,
        required: true,
    },
    dropOffLocation: {
        type: String,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    bookingName: {
        type: String,
        required: true,
    },
    bookedBy: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        rwquired: true,
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        required: true,
        default: IStatus.Pending,
    },
    businessName: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("VehicleReservation", VehicleReservation);
