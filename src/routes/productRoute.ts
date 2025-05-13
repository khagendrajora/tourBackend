import express from "express";
import {
  addTour,
  addTrek,
  addVehicle,
  deleteTour,
  deleteTrek,
  deleteVehicle,
  getTour,
  getTourByBusinessId,
  getTrek,
  getTrekByBusinessId,
  getVeh,
  getVehicleByBusinessId,
  tourDetails,
  trekDetails,
  updateTour,
  updateTrek,
  updateVeh,
  vehDetails,
} from "../controllers/productController";
import upload from "../middleware/fileUpload";
import { veriftyToken } from "../middleware/Auth";
// import { veriftyToken } from "../middleware/Auth";

const router = express.Router();

// Tour Routes
router.post(
  "/addtour",
  veriftyToken,
  upload.fields([{ name: "tourImages", maxCount: 1000 }]),
  addTour
);
router.get("/gettour", getTour);
router.get("/gettourdetails/:id", tourDetails);
router.get("/gettour/:businessid", getTourByBusinessId);
router.put(
  "/updatetour/:id",
  veriftyToken,
  upload.fields([{ name: "tourImages", maxCount: 1000 }]),
  updateTour
);
router.delete("/deletetour/:id", veriftyToken, deleteTour);

// Trek Routes

router.post(
  "/addtrek",
  veriftyToken,
  upload.fields([{ name: "trekImages", maxCount: 1000 }]),
  addTrek
);
router.get("/gettrek", getTrek);
router.get("/gettrek/:businessid", getTrekByBusinessId);
router.get("/gettrekdetails/:id", trekDetails);
router.put(
  "/updatetrek/:id",
  veriftyToken,
  upload.fields([{ name: "trekImages", maxCount: 1000 }]),
  updateTrek
);
router.delete("/deletetrek/:id", veriftyToken, deleteTrek);

// Venicle Routes

router.post(
  "/addveh",
  veriftyToken,
  upload.fields([{ name: "vehImages", maxCount: 1000 }]),
  addVehicle
);
router.get("/getveh", getVeh);
router.get("/getvehicle/:businessid", getVehicleByBusinessId);
router.get("/getvehdetails/:id", vehDetails);
router.put(
  "/updateveh/:id",
  veriftyToken,
  upload.fields([{ name: "vehImages", maxCount: 1000 }]),
  updateVeh
);

router.delete("/deletevehicle/:id", veriftyToken, deleteVehicle);

export default router;
