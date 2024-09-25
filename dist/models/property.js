"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    PropName: {
        type: String,
        required: true,
    },
    PropCategory: {
        type: String,
        required: true,
    },
    PropSubCategory: {
        type: String,
        required: true,
    },
    Address: {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        district: {
            type: String,
        },
        municipality: {
            type: String,
        },
        street: {
            type: String,
        },
        subrub: {
            type: String,
        },
        postcode: {
            type: String,
        },
    },
    Email: {
        type: String,
        required: true,
    },
    Website: {
        type: String,
        required: true,
    },
    Phone: {
        type: Number,
        required: true,
    },
    BusinessReg: {
        type: String,
        required: true,
    },
    Tax: {
        type: String,
        required: true,
    },
    ContactName: {
        type: String,
        required: true,
    },
    ContactPhone: {
        type: Number,
        required: true,
    },
    DateOfEstab: {
        type: Date,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Property", propertySchema);
