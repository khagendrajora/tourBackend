import express from "express";
import {
  addCountry,
  addDistrict,
  // addCountryState,
  addLocation,
  addMunicipality,
  addState,
  // addStateMunicipality,
  deleteCountry,
  deleteDistrict,
  deleteLocation,
  deleteMunicipality,
  deleteState,
  getCountry,
  getDistrict,
  getLocation,
  getLocationDetails,
  getMunicipality,
  getState,
  // importGandaki,
  // importkarnali,
  // importLumbini,
  // importprov1,
  // importprov2,
  // importsudur,
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

router.post("/addstate", addState);
router.get("/getstate", getState);
router.delete("/deletestate/:id", deleteState);

router.post("/adddistrict", addDistrict);
router.get("/getdistrict", getDistrict);
router.delete("/deletedistrict/:id", deleteDistrict);

router.post("/addmunicipality", addMunicipality);
router.get("/getmunicipality", getMunicipality);
router.delete("/deletemunicipality/:id", deleteMunicipality);
// router.post("/importsudur", upload.single("file"), importsudur);
// router.post("/importlumbini", upload.single("file"), importLumbini);
// router.post("/importgandaki", upload.single("file"), importGandaki);
// router.post("/import1", upload.single("file"), importprov1);
// router.post("/import2", upload.single("file"), importprov2);
// router.post("/importkarnali", upload.single("file"), importkarnali);
export default router;
