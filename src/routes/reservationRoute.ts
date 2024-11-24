import express from "express";
import {
  getAllReservations,
  getRevByBusinessId,
  getRevByClientId,
  getRevByVehicleId,
  updateReservationByBid,
  updateReservationStatusByBid,
  updateReservationStatusByClient,
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
router.put("/updateRevStatusbyclient/:id", updateReservationStatusByClient);
router.put("/updateRevStatusbybid/:id", updateReservationStatusByBid);
router.get("/getbusinessrev/:id", getRevByBusinessId);
router.put("/updateRevbybid/:id", updateReservationByBid);
router.get("/getalldates", getAllRevDates);
router.get("/getallreservations", getAllReservations);
router.get("/getrevbyvehid/:id", getRevByVehicleId);

export default router;
