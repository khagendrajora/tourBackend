"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_1 = require("../../controllers/Location/location");
const router = express_1.default.Router();
router.post("/addlocation", location_1.addLocation);
router.get("/getlocation", location_1.getLocation);
router.get("/getlocationdetails/:id", location_1.getLocationDetails);
router.put("/updatelocation", location_1.updateLocation);
router.delete("/deletelocation", location_1.deleteLocation);
exports.default = router;
