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
    createdAt: {
        type: Date,
    },
    time: {
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
    bookedByName: {
        required: true,
        type: String,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleImage: [
        {
            type: String,
        },
    ],
    capacity: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    sourceAddress: {
        type: String,
        required: true,
    },
    destinationAddress: {
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
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        required: true,
        default: IStatus.Pending,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("VehicleReservation", VehicleReservation);
