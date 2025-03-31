"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SalesSchema = new mongoose_1.default.Schema({
    businessId: {
        type: String,
        ref: "Business",
        required: true,
    },
    salesId: {
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
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Driver", "Sales"],
        default: "Sales",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("BusinessSales", SalesSchema);
