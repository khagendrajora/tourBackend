"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Feature_1 = require("../Featured/Feature");
const trekSchema = new mongoose_1.default.Schema({
    businessId: {
        type: String,
    },
    businessName: {
        type: String,
    },
    pickUpLocation: {
        type: String,
    },
    addedBy: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    price: {
        type: String,
    },
    isFeatured: {
        type: String,
        enum: Object.values(Feature_1.FeatureStatus),
        required: true,
        default: Feature_1.FeatureStatus.No,
    },
    trekId: {
        type: String,
        required: true,
    },
    prodCategory: {
        type: String,
        required: true,
    },
    prodsubCategory: {
        type: String,
        required: true,
    },
    inclusion: [
        {
            type: String,
            required: true,
        },
    ],
    dest: {
        type: String,
        required: true,
    },
    numbers: {
        type: Number,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    itinerary: {
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
    trekImages: [
        {
            type: String,
        },
    ],
});
exports.default = mongoose_1.default.model("Trekking", trekSchema);
