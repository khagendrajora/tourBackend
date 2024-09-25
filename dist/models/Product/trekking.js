"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trekSchema = new mongoose_1.default.Schema({
    prodCategory: {
        type: String,
        required: true,
    },
    prodsubCategory: {
        type: String,
        required: true,
    },
    inclusion: {
        type: String,
        required: true,
    },
    dest: {
        type: String,
        required: true,
    },
    numbers: {
        type: String,
        required: true,
    },
    days: {
        type: String,
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
            // required: true,
        },
    ],
    trek_images: [
        {
            type: String,
        },
    ],
});
exports.default = mongoose_1.default.model("Trekking", trekSchema);
