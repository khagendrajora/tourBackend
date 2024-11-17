"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    propName: {
        type: String,
        required: true,
    },
    propertyId: {
        type: String,
        required: true,
    },
    propCategory: {
        type: String,
        required: true,
    },
    propSubCategory: {
        type: String,
        required: true,
    },
    address: {
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
    email: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    businessReg: {
        type: String,
        required: true,
    },
    tax: {
        type: String,
        required: true,
    },
    contactName: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: Number,
        required: true,
    },
    dateOfEstab: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Property", propertySchema);
