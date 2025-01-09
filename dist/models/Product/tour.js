"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tourSchema = new mongoose_1.default.Schema({
    businessId: {
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
            required: true,
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
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
