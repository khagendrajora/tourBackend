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
} from "../controllers/Reservation/VehicleReservation/vehRevController";
import {
  getAllRevDates,
  getReservedDates,
} from "../controllers/Reservation/VehicleReservation/resrvedDated";
import {
  getTourRev,
  getTourRevByBid,
  getTourRevByUser,
  tourRev,
  updateTourRevStatusByBid,
  updateTourRevStatusByClient,
} from "../controllers/Reservation/TourReservation/tourRev";
import {
  getTrekRev,
  getTrekRevByBid,
  getTrekRevByUser,
  trekRev,
  updateTrekRevStatusByBid,
  updateTrekRevStatusByClient,
} from "../controllers/Reservation/TrekReservation/trekRev";
const router = express.Router();

//Vehicle reservation routes

router.post("/addRev/:id", vehReservation);
router.get("/reservdates/:id", getReservedDates);
router.get("/getclientrev/:id", getRevByClientId);
router.put("/updateRevStatusbyclient/:id", updateReservationStatusByClient);
router.put("/updateRevStatusbybid/:id", updateReservationStatusByBid);
router.get("/getbusinessrev/:id", getRevByBusinessId);
router.put("/updateRevbybid/:id", updateReservationByBid);
router.get("/getalldates", getAllRevDates);
router.get("/getallreservations", getAllReservations);
router.get("/getrevbyvehicleId/:id", getRevByVehicleId);

//Tour reservation routes

router.post("/addtourrev/:id", tourRev);
router.get("/gettourrev", getTourRev);
router.get("/gettourrevbyuserid/:id", getTourRevByUser);
router.get("/gettourrevbybid/:id", getTourRevByBid);
router.put("/updatetourRevStatusbyclient/:id", updateTourRevStatusByClient);
router.put("/updatetourRevStatusbybid/:id", updateTourRevStatusByBid);

//Trek reservation routes
router.post("/addtrekrev/:id", trekRev);
router.get("/gettrekrev", getTrekRev);
router.get("/gettrekrevbyuserid/:id", getTrekRevByUser);
router.get("/gettrekrevbybid/:id", getTrekRevByBid);
router.put("/updatetrekRevStatusbyclient/:id", updateTrekRevStatusByClient);
router.put("/updatetrekRevStatusbybid/:id", updateTrekRevStatusByBid);

export default router;
