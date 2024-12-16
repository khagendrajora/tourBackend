import express from "express";
import {
  addCountry,
  // addCountryState,
  addLocation,
  addMunicipality,
  addState,
  // addStateMunicipality,
  deleteCountry,
  deleteLocation,
  deleteMunicipality,
  deleteState,
  getCountry,
  getLocation,
  getLocationDetails,
  getMunicipality,
  getState,
  importUData,
  updateLocation,
} from "../../controllers/Location/location";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post("/addlocation", addLocation);
router.get("/getlocation", getLocation);
router.get("/getlocationdetails/:id", getLocationDetails);
router.put("/updatelocation/:id", updateLocation);
router.delete("/deletelocation", deleteLocation);

router.post("/addcountry", addCountry);
router.get("/getcountry", getCountry);
router.delete("/deletecountry/:id", deleteCountry);
// router.put("/addcountrystate/:id", addCountryState);

router.post("/addstate", addState);
router.get("/getstate", getState);
router.delete("/deletestate/:id", deleteState);
// router.put("/addstatemunicipality/:id", addStateMunicipality);

router.post("/addmunicipality", addMunicipality);
router.get("/getmunicipality", getMunicipality);
router.delete("/deletemunicipality/:id", deleteMunicipality);
router.post("/importdata", upload.single("file"), importUData);
// router.put("/addstatemunicipality/:id", addStateMunicipality);

export default router;
