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
    addedBy: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    businessId: {
        type: String,
        ref: "Business",
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        default: IStatus.Available,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Driver", "Sales"],
        default: "Sales",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Driver", driverSchema);
