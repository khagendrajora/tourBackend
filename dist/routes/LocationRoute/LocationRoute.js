"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_1 = require("../../controllers/Location/location");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const router = express_1.default.Router();
router.post("/addlocation", location_1.addLocation);
router.get("/getlocation", location_1.getLocation);
router.get("/getlocationdetails/:id", location_1.getLocationDetails);
router.put("/updatelocation/:id", location_1.updateLocation);
router.delete("/deletelocation", location_1.deleteLocation);
router.post("/addcountry", location_1.addCountry);
router.get("/getcountry", location_1.getCountry);
router.delete("/deletecountry/:id", location_1.deleteCountry);
// router.put("/addcountrystate/:id", addCountryState);
router.post("/addstate", location_1.addState);
router.get("/getstate", location_1.getState);
router.delete("/deletestate/:id", location_1.deleteState);
// router.put("/addstatemunicipality/:id", addStateMunicipality);
router.post("/addmunicipality", location_1.addMunicipality);
router.get("/getmunicipality", location_1.getMunicipality);
router.delete("/deletemunicipality/:id", location_1.deleteMunicipality);
router.post("/importdata", fileUpload_1.default.single("file"), location_1.importUData);
// router.put("/addstatemunicipality/:id", addStateMunicipality);
exports.default = router;
