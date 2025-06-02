import express from "express";
import {
  addDriver,
  deleteDriver,
  getDriverByBId,
  getDriverById,
  getDrivers,
  getReservations,
  resetPwd,
  updateDriver,
  updateDriverDates,
  updateDriverStatus,
  verifyDriverEmail,
} from "../../controllers/BusinessController/driver";
import upload from "../../middleware/fileUpload";
import {
  addHotDeals,
  deleteHotDeals,
  getHotDeals,
  getHotDealsById,
  getHotDealsByvehicleId,
  updateHotdeals,
} from "../../controllers/HotDealsControllers/HotDealsCOntroller";
import { veriftyToken } from "../../middleware/Auth";

const router = express.Router();

//Driver routes
router.post(
  "/adddriver",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addDriver
);

router.get("/getdrivers", getDrivers);
router.get("/getdriver/:id", getDriverById);
router.get("/getdriverbybid/:id", getDriverByBId);

router.put("/updatedriverstatus/:id", veriftyToken, updateDriverStatus);
router.delete("/deletedriver/:id", veriftyToken, deleteDriver);
router.put(
  "/updatedriver/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  veriftyToken,
  updateDriver
);
router.put("/updatedates/:id", veriftyToken, updateDriverDates);
router.put("/resetdriverpwd/:token", resetPwd);
router.put("/verifydriveremail/:token", verifyDriverEmail);
router.post("/getreservations", getReservations);

//Hot deals routes

router.post("/addhotdeals/:id", addHotDeals);
router.get("/gethotdeals", getHotDeals);
router.get("/gethodealbyid/:id", getHotDealsById);
router.get("/gethotdealbyvehicleId/:id", getHotDealsByvehicleId);
router.put("/updatehotdeal/:id", updateHotdeals);
router.delete("/deletehotdeal/:id", deleteHotDeals);

export default router;
