import express from "express";
import {
  getRevByClientId,
  updateReservationStatus,
  vehReservation,
} from "../controllers/Reservation/vehRevController";
import { getReservedDates } from "../controllers/Reservation/resrvedDated";
const router = express.Router();

router.post("/addRev/:id", vehReservation);

router.get("/reservdates/:id", getReservedDates);

router.get("/getclientrev/:id", getRevByClientId);
router.put("/updateRevStatus/:id", updateReservationStatus);

export default router;
