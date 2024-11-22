import express from "express";
import {
  getAllReservations,
  getRevByBusinessId,
  getRevByClientId,
  updateReservationByBid,
  updateReservationStatus,
  vehReservation,
} from "../controllers/Reservation/vehRevController";
import {
  getAllRevDates,
  getReservedDates,
} from "../controllers/Reservation/resrvedDated";
const router = express.Router();

router.post("/addRev/:id", vehReservation);

router.get("/reservdates/:id", getReservedDates);

router.get("/getclientrev/:id", getRevByClientId);
router.put("/updateRevStatus/:id", updateReservationStatus);
router.get("/getbusinessrev/:id", getRevByBusinessId);
router.put("/updateRevbybid/:id", updateReservationByBid);
router.get("/getalldates", getAllRevDates);
router.get("/getallreservations", getAllReservations);

export default router;
