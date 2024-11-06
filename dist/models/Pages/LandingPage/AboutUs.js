"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hotDeals = new mongoose_1.default.Schema({
    startingPrice: {
        type: String,
    },
    sourceAddress: {
        type: String,
    },
    destAddress: {
        type: String,
    },
    vehicle: {
        type: String,
    },
    travelName: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("AboutUs", hotDeals);
