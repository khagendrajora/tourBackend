"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const featureSchema = new mongoose_1.default.Schema({
    Id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Feature", featureSchema);
