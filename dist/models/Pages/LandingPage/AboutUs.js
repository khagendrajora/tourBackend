"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aboutUsSchema = new mongoose_1.default.Schema({
    starting_price: {
        type: String,
    },
    source_dest: { type: String },
    dest: { type: String },
    vehicle: { type: String },
    travel_name: { type: String },
});
exports.default = mongoose_1.default.model("AboutUs", aboutUsSchema);
