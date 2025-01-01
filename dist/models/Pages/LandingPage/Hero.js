"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const heroSchema = new mongoose_1.default.Schema({
    heroImage: [
        {
            type: String,
        },
    ],
    heading: {
        type: String,
    },
    description: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("Hero", heroSchema);
