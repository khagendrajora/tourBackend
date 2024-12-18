"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var IStatus;
(function (IStatus) {
    IStatus["Available"] = "Available";
    IStatus["Unavailable"] = "Unavailable";
    IStatus["Leave"] = "Leave";
    IStatus["Occupied"] = "Occupied";
})(IStatus || (exports.IStatus = IStatus = {}));
const driverSchema = new mongoose_1.default.Schema({
    vehicleId: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    driverPwd: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    // bookingId: {
    //   type: String,
    //   required: true,
    // },
    driverEmail: {
        type: String,
    },
    businessId: {
        type: String,
        required: true,
    },
    driverAge: {
        type: Number,
        required: true,
    },
    driverName: {
        type: String,
        required: true,
    },
    driverPhone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        default: IStatus.Available,
        required: true,
    },
    driverImage: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Driver", driverSchema);
