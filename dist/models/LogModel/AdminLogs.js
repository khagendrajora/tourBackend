"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminLogs = new mongoose_1.default.Schema({
    updatedBy: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("AdminLogs", adminLogs);
