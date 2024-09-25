"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const Validation_1 = require("../validation/Validation");
const router = express_1.default.Router();
router.post("/addproperty", Validation_1.addPropertyData, Validation_1.validation, propertyController_1.addProperty);
router.get("/getproperty", propertyController_1.getProperty);
router.get("/propertydetails/:id", propertyController_1.propertyDetails);
router.put("/updateproperty/:id", propertyController_1.updateProperty);
router.delete("/deleteproperty/:id", propertyController_1.deleteProperty);
exports.default = router;
