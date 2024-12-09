import express from "express";
import {
  addLocation,
  deleteLocation,
  getLocation,
  getLocationDetails,
  updateLocation,
} from "../../controllers/Location/location";

const router = express.Router();

router.post("/addlocation", addLocation);
router.get("/getlocation", getLocation);
router.get("/getlocationdetails/:id", getLocationDetails);
router.put("/updatelocation/:id", updateLocation);
router.delete("/deletelocation", deleteLocation);

export default router;
