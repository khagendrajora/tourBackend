"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Veh_Rev = new mongoose_1.default.Schema({
    veh_id: {
        type: String,
        required: true,
    },
    veh_type: {
        type: String,
        required: true,
    },
    services: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    sourceAdd: {
        type: String,
        required: true,
    },
    destAdd: {
        type: String,
        required: true,
    },
    amenities: {
        type: String,
        required: true,
    },
    veh_number: {
        type: String,
        required: true,
    },
    veh_name: {
        type: String,
        required: true,
    },
    passenger_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    bookingDate: [
        {
            type: String,
        },
    ],
});
exports.default = mongoose_1.default.model("VehRev", Veh_Rev);
