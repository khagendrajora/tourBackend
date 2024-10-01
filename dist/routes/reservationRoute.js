"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehRevController_1 = require("../controllers/Reservation/vehRevController");
const resrvedDated_1 = require("../controllers/Reservation/resrvedDated");
const Validation_1 = require("../validation/Validation");
const router = express_1.default.Router();
router.post("/addRev/:id", Validation_1.reservationData, Validation_1.validation, vehRevController_1.veh_Rev);
router.get("/reservdates/:id", resrvedDated_1.getReservDates);
exports.default = router;
