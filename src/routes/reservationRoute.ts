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
import {
  getTourRev,
  getTourRevByBid,
  getTourRevByUser,
  tourRev,
} from "../controllers/Reservation/TourReservation/tourRev";
import {
  getTrekRev,
  getTrekRevByBid,
  getTrekRevByUser,
  trekRev,
} from "../controllers/Reservation/TrekReservation/trekRev";
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

router.post("/tourrev/:id", tourRev);
router.get("/gettourrev", getTourRev);
router.get("/gettourrevbyuserid/:id", getTourRevByUser);
router.get("/gettourrevbybid/:id", getTourRevByBid);

router.post("/trekrev/:id", trekRev);
router.get("/gettrekrev", getTrekRev);
router.get("/gettrekrevbyuserid/:id", getTrekRevByUser);
router.get("/gettrekrevbybid/:id", getTrekRevByBid);

export default router;
