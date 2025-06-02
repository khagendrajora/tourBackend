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
    IStatus["Inactive"] = "Inactive";
})(IStatus || (exports.IStatus = IStatus = {}));
const driverSchema = new mongoose_1.default.Schema({
    DOB: {
        type: String,
        required: true,
    },
    bookingId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "VehicleReservation",
        },
    ],
    operationalDate: [
        {
            type: String,
        },
    ],
    addedBy: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
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
        default: IStatus.Inactive,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Driver", "Sales"],
        default: "Driver",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Driver", driverSchema);
