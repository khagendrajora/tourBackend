"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const salesController_1 = require("../../controllers/BusinessController/salesController");
const router = express_1.default.Router();
router.post("/addsales", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), salesController_1.addSales);
router.get("/getsales/:id", salesController_1.getBusinessSales);
router.put("/updatesales/:id", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), salesController_1.updateBusinessSales);
exports.default = router;
