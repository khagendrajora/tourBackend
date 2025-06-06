"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driver_1 = require("../../controllers/BusinessController/driver");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const HotDealsCOntroller_1 = require("../../controllers/HotDealsControllers/HotDealsCOntroller");
const Auth_1 = require("../../middleware/Auth");
const router = express_1.default.Router();
//Driver routes
router.post("/adddriver", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), driver_1.addDriver);
router.get("/getdrivers", driver_1.getDrivers);
router.get("/getdriver/:id", driver_1.getDriverById);
router.get("/getdriverbybid/:id", driver_1.getDriverByBId);
router.put("/updatedriverstatus/:id", Auth_1.veriftyToken, driver_1.updateDriverStatus);
router.delete("/deletedriver/:id", Auth_1.veriftyToken, driver_1.deleteDriver);
router.put("/updatedriver/:id", fileUpload_1.default.fields([{ name: "image", maxCount: 1 }]), Auth_1.veriftyToken, driver_1.updateDriver);
router.put("/updatedates/:id", Auth_1.veriftyToken, driver_1.updateDriverDates);
router.put("/resetdriverpwd/:token", driver_1.resetPwd);
router.put("/verifydriveremail/:token", driver_1.verifyDriverEmail);
router.post("/getreservations", driver_1.getReservations);
//Hot deals routes
router.post("/addhotdeals/:id", HotDealsCOntroller_1.addHotDeals);
router.get("/gethotdeals", HotDealsCOntroller_1.getHotDeals);
router.get("/gethodealbyid/:id", HotDealsCOntroller_1.getHotDealsById);
router.get("/gethotdealbyvehicleId/:id", HotDealsCOntroller_1.getHotDealsByvehicleId);
router.put("/updatehotdeal/:id", HotDealsCOntroller_1.updateHotdeals);
router.delete("/deletehotdeal/:id", HotDealsCOntroller_1.deleteHotDeals);
exports.default = router;
