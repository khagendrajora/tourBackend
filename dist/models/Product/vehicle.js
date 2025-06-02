"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Feature_1 = require("../Featured/Feature");
var ICondition;
(function (ICondition) {
    ICondition["Good"] = "Good";
})(ICondition || (ICondition = {}));
const VehSchema = new mongoose_1.default.Schema({
    businessId: {
        type: String,
    },
    driver: {
        type: String,
    },
    price: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    addedBy: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: String,
        enum: Object.values(Feature_1.FeatureStatus),
        required: true,
        default: Feature_1.FeatureStatus.No,
    },
    vehicleId: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    baseLocation: {
        type: String,
        required: true,
    },
    vehCategory: {
        type: String,
        required: true,
    },
    vehSubCategory: {
        type: String,
        required: true,
    },
    services: [
        {
            type: String,
            required: true,
        },
    ],
    amenities: [
        {
            type: String,
            required: true,
        },
    ],
    capacity: {
        type: String,
        required: true,
    },
    vehCondition: {
        type: String,
        enum: Object.values(ICondition),
        required: true,
    },
    vehNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    operationDates: [
        {
            type: String,
        },
    ],
    manufacturer: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    VIN: {
        type: String,
        required: true,
    },
    madeYear: {
        type: Date,
        required: true,
    },
    vehImages: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Vehicle", VehSchema);
