"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ManagerSchema = new mongoose_1.default.Schema({
    businessId: {
        type: String,
        ref: "Business",
        required: true,
    },
    image: {
        type: String,
    },
    managerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Driver", "Sales"],
        default: "Manager",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("BusinessManager", ManagerSchema);
