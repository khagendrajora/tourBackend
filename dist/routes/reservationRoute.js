"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehRevController_1 = require("../controllers/Reservation/VehicleReservation/vehRevController");
const resrvedDated_1 = require("../controllers/Reservation/VehicleReservation/resrvedDated");
const tourRev_1 = require("../controllers/Reservation/TourReservation/tourRev");
const trekRev_1 = require("../controllers/Reservation/TrekReservation/trekRev");
const router = express_1.default.Router();
//Vehicle reservation routes
router.post("/addRev/:id", vehRevController_1.vehReservation);
router.get("/reservdates/:id", resrvedDated_1.getReservedDates);
router.get("/getclientrev/:id", vehRevController_1.getRevByClientId);
router.put("/updateRevStatusbyclient/:id", vehRevController_1.updateReservationStatusByClient);
router.put("/updateRevStatusbybid/:id", vehRevController_1.updateReservationStatusByBid);
router.get("/getbusinessrev/:id", vehRevController_1.getRevByBusinessId);
router.put("/updateRevbybid/:id", vehRevController_1.updateReservationByBid);
router.get("/getalldates", resrvedDated_1.getAllRevDates);
router.get("/getallreservations", vehRevController_1.getAllReservations);
router.get("/getrevbyvehicleId/:id", vehRevController_1.getRevByVehicleId);
//Tour reservation routes
router.post("/addtourrev/:id", tourRev_1.tourRev);
router.get("/gettourrev", tourRev_1.getTourRev);
router.get("/gettourrevbyuserid/:id", tourRev_1.getTourRevByUser);
router.get("/gettourrevbybid/:id", tourRev_1.getTourRevByBid);
router.put("/updatetourRevStatusbyclient/:id", tourRev_1.updateTourRevStatusByClient);
router.put("/updatetourRevStatusbybid/:id", tourRev_1.updateTourRevStatusByBid);
//Trek reservation routes
router.post("/addtrekrev/:id", trekRev_1.trekRev);
router.get("/gettrekrev", trekRev_1.getTrekRev);
router.get("/gettrekrevbyuserid/:id", trekRev_1.getTrekRevByUser);
router.get("/gettrekrevbybid/:id", trekRev_1.getTrekRevByBid);
router.put("/updatetrekRevStatusbyclient/:id", trekRev_1.updateTrekRevStatusByClient);
router.put("/updatetrekRevStatusbybid/:id", trekRev_1.updateTrekRevStatusByBid);
exports.default = router;
