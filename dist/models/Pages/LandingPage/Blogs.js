"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogsSchema = new mongoose_1.default.Schema({
    blogsImage: [
        {
            type: String,
        },
    ],
    blogId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("Blogs", blogsSchema);
