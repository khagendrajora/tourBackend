"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehRev = new mongoose_1.default.Schema({
    vehId: {
        type: String,
        required: true,
    },
    vehType: {
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
    sourceAddress: {
        type: String,
        required: true,
    },
    destAddress: {
        type: String,
        required: true,
    },
    amenities: {
        type: String,
        required: true,
    },
    vehNumber: {
        type: String,
        required: true,
    },
    vehName: {
        type: String,
        required: true,
    },
    passengerName: {
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
exports.default = mongoose_1.default.model("VehRev", VehRev);
