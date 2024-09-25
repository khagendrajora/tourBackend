"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const businessSchema = new mongoose_1.default.Schema({
    businessName: {
        type: String,
        required: true,
    },
    businessCategory: {
        type: String,
        required: true,
    },
    taxRegistration: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    primaryEmail: {
        type: String,
        required: true,
        unique: true,
    },
    primaryPhone: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Business", businessSchema);
