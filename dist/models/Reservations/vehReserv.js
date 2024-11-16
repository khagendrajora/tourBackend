"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var IStatus;
(function (IStatus) {
    IStatus["Active"] = "Active";
    IStatus["Cancel"] = "Canceled";
    IStatus["Fullfilled"] = "Fulfilled";
})(IStatus || (IStatus = {}));
const VehicleReservation = new mongoose_1.default.Schema({
    vehicleId: {
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
    capacity: {
        type: String,
        required: true,
    },
    // services: {
    //   type: String,
    // },
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
    // amenities: {
    //   type: String,
    // },
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
    bookingDate: [
        {
            type: Date,
        },
    ],
    status: {
        type: String,
        enum: Object.values(IStatus),
        required: true,
        default: IStatus.Active,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("VehicleReservation", VehicleReservation);
