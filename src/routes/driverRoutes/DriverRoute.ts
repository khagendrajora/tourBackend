import express from "express";
import {
  addDriver,
  deleteDriver,
  getDriverByBId,
  getDriverById,
  getDrivers,
  getDriverVehicles,
  resetPwd,
  updateDriver,
  updateDriverStatus,
  verifyDriverEmail,
} from "../../controllers/DriverController/driver";
import upload from "../../middleware/fileUpload";
import {
  addHotDeals,
  deleteHotDeals,
  getHotDeals,
  getHotDealsById,
  getHotDealsByVehId,
  updateHotdeals,
} from "../../controllers/HotDealsControllers/HotDealsCOntroller";

const router = express.Router();

//Driver routes
router.post(
  "/adddriver",
  upload.fields([{ name: "driverImage", maxCount: 1 }]),
  addDriver
);

router.get("/getdrivers", getDrivers);
router.get("/getdrivers/:id", getDriverById);
router.get("/getdriverbybid/:id", getDriverByBId);
router.get("/getdrivervehicle/:vehicleId", getDriverVehicles);

router.put("/updatedriverstatus/:id", updateDriverStatus);
router.delete("/deletedriver/:id", deleteDriver);
router.put(
  "/updatedriver/:id",
  upload.fields([{ name: "driverImage", maxCount: 1 }]),
  updateDriver
);
router.put("/resetdriverpwd/:token", resetPwd);
router.put("/resetandverifyemail/:token", verifyDriverEmail);

//Hot deals routes

router.post("/addhotdeals/:id", addHotDeals);
router.get("/gethotdeals", getHotDeals);
router.get("/gethodealbyid/:id", getHotDealsById);
router.get("/gethotdealbyvehid/:id", getHotDealsByVehId);
router.put("/updatehotdeal/:id", updateHotdeals);
router.delete("/deletehotdeal/:id", deleteHotDeals);

export default router;
