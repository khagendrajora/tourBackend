"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const revDates = new mongoose_1.default.Schema({
    vehicleId: {
        type: String,
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    bookedBy: {
        type: String,
        required: true,
    },
    bookingDate: [
        {
            type: Date,
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("ReservedDate", revDates);
