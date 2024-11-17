"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminUserSchema = new mongoose_1.default.Schema({
    adminName: {
        type: String,
        required: true,
    },
    adminId: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
    },
    adminPwd: {
        type: String,
        required: true,
    },
    adminRole: {
        type: String,
        default: "1",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("AdminUser", adminUserSchema);
