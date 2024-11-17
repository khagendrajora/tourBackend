import express from "express";
import {
  getRevByBusinessId,
  getRevByClientId,
  updateReservationByBid,
  updateReservationStatus,
  vehReservation,
} from "../controllers/Reservation/vehRevController";
import { getReservedDates } from "../controllers/Reservation/resrvedDated";
const router = express.Router();

router.post("/addRev/:id", vehReservation);

router.get("/reservdates/:id", getReservedDates);

router.get("/getclientrev/:id", getRevByClientId);
router.put("/updateRevStatus/:id", updateReservationStatus);
router.get("/getbusinessrev/:id", getRevByBusinessId);
router.put("/updateRevbybid/:id", updateReservationByBid);

export default router;
