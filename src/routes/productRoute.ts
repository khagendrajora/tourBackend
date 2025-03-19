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
// import { veriftyToken } from "../middleware/Auth";

const router = express.Router();

// Tour Routes
router.post(
  "/addtour",
  // veriftyToken,
  upload.fields([{ name: "tourImages", maxCount: 1000 }]),
  addTour
);
router.get("/gettour", getTour);
router.get("/gettourdetails/:id", tourDetails);
router.get("/gettour/:businessid", getTourByBusinessId);
router.put(
  "/updatetour/:id",
  upload.fields([{ name: "tourImages", maxCount: 1000 }]),
  updateTour
);
router.delete("/deletetour/:id", deleteTour);

// Trek Routes

router.post(
  "/addtrek",
  upload.fields([{ name: "trekImages", maxCount: 1000 }]),
  addTrek
);
router.get("/gettrek", getTrek);
router.get("/gettrek/:businessid", getTrekByBusinessId);
router.get("/gettrekdetails/:id", trekDetails);
router.put(
  "/updatetrek/:id",
  upload.fields([{ name: "trekImages", maxCount: 1000 }]),
  updateTrek
);
router.delete("/deletetrek/:id", deleteTrek);

// Venicle Routes

router.post(
  "/addveh",
  upload.fields([{ name: "vehImages", maxCount: 1000 }]),
  addVehicle
);
router.get("/getveh", getVeh);
router.get("/getvehicle/:businessid", getVehicleByBusinessId);
router.get("/getvehdetails/:id", vehDetails);
router.put(
  "/updateveh/:id",
  upload.fields([{ name: "vehImages", maxCount: 1000 }]),
  updateVeh
);

router.delete("/deletevehicle/:id", deleteVehicle);

export default router;
