"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importStar(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storage = (0, multer_1.diskStorage)({
    destination: function (req, file, cb) {
        let fileDestination = "public/uploads";
        if (!fs_1.default.existsSync(fileDestination)) {
            fs_1.default.mkdirSync(fileDestination, { recursive: true });
            cb(null, fileDestination);
        }
        else {
            cb(null, fileDestination);
        }
    },
    filename: function (req, file, cb) {
        let filename = path_1.default.basename(file.originalname, path_1.default.extname(file.originalname));
        let extnam = path_1.default.extname(file.originalname);
        cb(null, filename + "_" + Date.now() + extnam);
    },
});
const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg|webp|gif|JPG|PNG|JPEG|xlsx|csv)$/)) {
        return cb(new Error("Only jpg|png|jpeg|webp|gif|JPG|PNG|JPEG are supported"));
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
});
exports.default = upload;
