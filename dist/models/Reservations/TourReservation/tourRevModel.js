"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vehReserv_1 = require("../VehicleReservation/vehReserv");
const TourReservation = new mongoose_1.default.Schema({
    bookingId: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    bookedBy: {
        type: String,
        required: true,
    },
    businessId: {
        type: String,
        required: true,
    },
    tourId: {
        type: String,
        required: true,
    },
    tourName: {
        type: String,
        required: true,
    },
    bookingName: {
        type: String,
        required: true,
    },
    numberOfPeople: {
        type: Number,
        required: true,
    },
    email: {
        required: true,
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(vehReserv_1.IStatus),
        required: true,
        default: vehReserv_1.IStatus.Pending,
    },
    phone: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("TourReservation", TourReservation);
