"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const popularDestSchema = new mongoose_1.default.Schema({
    destImage: [
        {
            type: String,
        },
    ],
    destId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("Destination", popularDestSchema);
