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
    IStatus["completed"] = "Completed";
    IStatus["Pending"] = "Pending";
})(IStatus || (exports.IStatus = IStatus = {}));
const TrekReservation = new mongoose_1.default.Schema({
    bookingId: {
        type: String,
        required: true,
    },
    businessId: {
        type: String,
        required: true,
    },
    trekId: {
        type: String,
        required: true,
    },
    trekName: {
        type: String,
        required: true,
    },
    passengerName: {
        type: String,
        required: true,
    },
    tickets: {
        type: Number,
        required: true,
    },
    email: {
        required: true,
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    // end: {
    //   type: String,
    //   required: true,
    // },
    phone: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        required: true,
        default: IStatus.Pending,
    },
    bookedBy: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("TrekReservation", TrekReservation);
