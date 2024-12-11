"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stateSchema = new mongoose_1.default.Schema({
    state: {
        type: String,
        required: true,
    },
    municipality: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("State", stateSchema);
