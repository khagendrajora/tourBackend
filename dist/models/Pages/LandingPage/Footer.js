"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const footerSchema = new mongoose_1.default.Schema({
    facebook: {
        type: String,
    },
    twiter: {
        type: String,
    },
    whatapp: {
        type: String,
    },
    youtube: {
        type: String,
    },
    instagram: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("Footer", footerSchema);
