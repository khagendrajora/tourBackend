"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminUserSchema = new mongoose_1.default.Schema({
    adminName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Pwd: {
        type: String,
        required: true,
    },
    cPwd: {
        type: String,
        required: true,
    },
    Role: {
        type: Boolean,
        default: true,
    },
});
exports.default = mongoose_1.default.model("AdminUser", adminUserSchema);
