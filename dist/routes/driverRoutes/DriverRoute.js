"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driver_1 = require("../../controllers/DriverController/driver");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const router = express_1.default.Router();
router.post("/adddriver", fileUpload_1.default.fields([{ name: "driverImage", maxCount: 1 }]), driver_1.addDriver);
router.put("/verifydriveremail/:token", driver_1.verifyDriverEmail);
router.post("/driverlogin", driver_1.driverLogin);
router.get("/getdrivers", driver_1.getDrivers);
router.get("/getdrivers/:id", driver_1.getDriverById);
router.put("/updatedriver/:id", driver_1.updateDriverStatus);
router.delete("/deletedriver/:id", driver_1.deleteDriver);
exports.default = router;
