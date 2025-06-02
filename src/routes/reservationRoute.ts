import express from "express";
import {
  assignDriver,
  getAllReservations,
  getRevByBusinessId,
  getRevByClientId,
  getRevByVehicleId,
  removeDriver,
  // updateReservationByBid,
  updateReservationStatusByBid,
  updateReservationStatusByClient,
  vehReservation,
} from "../controllers/Reservation/VehicleReservation/vehRevController";
import {
  getAllRevDates,
  getReservedDates,
  getReservedDatesByBookingId,
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
import { veriftyToken } from "../middleware/Auth";
const router = express.Router();

//Vehicle reservation routes

router.post("/addRev/:id", veriftyToken, vehReservation);
router.put("/updateRevStatusbyclient/:id", updateReservationStatusByClient);
router.put(
  "/updateRevStatusbybusinessId/:id",
  veriftyToken,
  updateReservationStatusByBid
);
router.put("/assigndriver/:id", veriftyToken, assignDriver);
router.put("/removedriver/:id", veriftyToken, removeDriver);
// router.put("/updateRevbybusinessId/:id", updateReservationByBid);

router.get("/getbusinessrev/:id", getRevByBusinessId);
router.get("/reservdates/:id", getReservedDates);
router.get("/reservdatesbybookingId/:id", getReservedDatesByBookingId);
router.get("/getuserrev/:id", getRevByClientId);
router.get("/getalldates", getAllRevDates);
router.get("/getallreservations", getAllReservations);
router.get("/getrevbyvehicleId/:id", getRevByVehicleId);

//Tour reservation routes

router.post("/addtourrev/:id", veriftyToken, tourRev);
router.get("/gettourrev", getTourRev);
router.get("/gettourrevbyuserid/:id", getTourRevByUser);
router.get("/gettourrevbybid/:id", getTourRevByBid);
router.put("/updatetourRevStatusbyclient/:id", updateTourRevStatusByClient);
router.put("/updatetourRevStatusbybid/:id", updateTourRevStatusByBid);

//Trek reservation routes
router.post("/addtrekrev/:id", veriftyToken, trekRev);
router.get("/gettrekrev", getTrekRev);
router.get("/gettrekrevbyuserid/:id", getTrekRevByUser);
router.get("/gettrekrevbybid/:id", getTrekRevByBid);
router.put("/updatetrekRevStatusbyclient/:id", updateTrekRevStatusByClient);
router.put(
  "/updatetrekRevStatusbybusinessId/:id",
  veriftyToken,
  updateTrekRevStatusByBid
);

export default router;
