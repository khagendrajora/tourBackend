"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehRevController_1 = require("../controllers/Reservation/vehRevController");
const resrvedDated_1 = require("../controllers/Reservation/resrvedDated");
const router = express_1.default.Router();
router.post("/addRev/:id", vehRevController_1.vehReservation);
router.get("/reservdates/:id", resrvedDated_1.getReservedDates);
router.get("/getclientrev/:id", vehRevController_1.getRevByClientId);
router.put("/updateRevStatusbyclient/:id", vehRevController_1.updateReservationStatusByClient);
router.put("/updateRevStatusbybid/:id", vehRevController_1.updateReservationStatusByBid);
router.get("/getbusinessrev/:id", vehRevController_1.getRevByBusinessId);
router.put("/updateRevbybid/:id", vehRevController_1.updateReservationByBid);
router.get("/getalldates", resrvedDated_1.getAllRevDates);
router.get("/getallreservations", vehRevController_1.getAllReservations);
exports.default = router;
