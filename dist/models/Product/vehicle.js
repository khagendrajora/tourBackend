"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var ICondition;
(function (ICondition) {
    ICondition["Good"] = "Good";
    ICondition["Bad"] = "Bad";
})(ICondition || (ICondition = {}));
const VehSchema = new mongoose_1.default.Schema({
    vehCategory: {
        type: String,
        required: true,
    },
    vehSubCategory: {
        type: String,
        required: true,
    },
    services: {
        type: String,
        required: true,
    },
    amenities: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    vehCondition: {
        type: String,
        enum: Object.values(ICondition),
        required: true,
    },
    vehNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    operationDates: [
        {
            type: String,
            required: true,
        },
    ],
    madeYear: {
        type: Date,
        required: true,
    },
    vehImages: [
        {
            type: String,
        },
    ],
});
exports.default = mongoose_1.default.model("Vehicle", VehSchema);
