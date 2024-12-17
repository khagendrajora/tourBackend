"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const municipalitySchema = new mongoose_1.default.Schema({
    municipality: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    // country: {
    //   type: String,
    //   required: true,
    // },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Municipality", municipalitySchema);
