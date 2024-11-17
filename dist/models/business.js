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
    bId: {
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
    businessAddress: {
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
    businessPwd: {
        type: String,
        required: true,
    },
    businessRole: {
        type: String,
        default: "1",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Business", businessSchema);
