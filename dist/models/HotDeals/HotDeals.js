"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IHotDealStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var IHotDealStatus;
(function (IHotDealStatus) {
    IHotDealStatus["Available"] = "Available";
    IHotDealStatus["Unavailable"] = "Unavailable";
})(IHotDealStatus || (exports.IHotDealStatus = IHotDealStatus = {}));
const hotDealsSchema = new mongoose_1.default.Schema({
    vehicleId: {
        type: String,
        required: true,
    },
    termsAndCondition: {
        type: String,
        // required: true,
    },
    time: {
        type: String,
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    sourceAddress: {
        type: String,
        required: true,
    },
    destAddress: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    hdID: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    businessId: {
        type: String,
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
        enum: Object.values(IHotDealStatus),
        default: IHotDealStatus.Available,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("HotDeals", hotDealsSchema);
