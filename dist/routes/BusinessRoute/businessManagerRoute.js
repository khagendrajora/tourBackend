"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const bManagerController_1 = require("../../controllers/BusinessController/bManagerController");
const router = express_1.default.Router();
router.post("/addmanager", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), bManagerController_1.addBusinessManager);
router.get("/getmanager/:id", bManagerController_1.getBusinessManager);
router.put("/updatemanager/:id", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), bManagerController_1.updateBusinessManager);
exports.default = router;
