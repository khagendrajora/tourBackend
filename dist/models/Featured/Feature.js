"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var FeatureStatus;
(function (FeatureStatus) {
    FeatureStatus["Accepted"] = "Accepted";
    FeatureStatus["Reject"] = "Rejected";
    FeatureStatus["Pending"] = "Pending";
})(FeatureStatus || (exports.FeatureStatus = FeatureStatus = {}));
const featureSchema = new mongoose_1.default.Schema({
    Id: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    productId: {
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
    status: {
        type: String,
        enum: Object.values(FeatureStatus),
        required: true,
        default: FeatureStatus.Pending,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Feature", featureSchema);
