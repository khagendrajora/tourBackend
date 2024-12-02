"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TourReservation = new mongoose_1.default.Schema({
    bookingId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    tourId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tickets: {
        type: String,
        required: true,
    },
    email: {
        required: true,
        type: String,
    },
    from: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
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
