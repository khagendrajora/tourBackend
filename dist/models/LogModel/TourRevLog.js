"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tourRevLogs = new mongoose_1.default.Schema({
    updatedBy: {
        type: String,
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("TourRevLogs", tourRevLogs);
