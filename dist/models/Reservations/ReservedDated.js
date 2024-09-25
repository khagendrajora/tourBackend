"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rev_dates = new mongoose_1.default.Schema({
    veh_id: {
        type: String,
        required: true,
    },
    bookingDate: [
        {
            type: String,
        },
    ],
});
exports.default = mongoose_1.default.model("RevDate", rev_dates);
