"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Feature_1 = require("../Featured/Feature");
const tourSchema = new mongoose_1.default.Schema({
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
    tourId: {
        type: String,
        required: true,
    },
    prodCategory: {
        type: String,
    },
    prodsubCategory: {
        type: String,
    },
    inclusion: [
        {
            type: String,
            required: true,
        },
    ],
    dest: {
        type: String,
    },
    duration: {
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
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    operationDates: [
        {
            type: String,
        },
    ],
    isFeatured: {
        type: String,
        enum: Object.values(Feature_1.FeatureStatus),
        required: true,
        default: Feature_1.FeatureStatus.No,
    },
    tourImages: [
        {
            type: String,
        },
    ],
    capacity: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("Tour", tourSchema);
