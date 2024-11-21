import express from "express";
import {
  addDriver,
  deleteDriver,
  driverLogin,
  getDriverById,
  getDrivers,
  updateDriverStatus,
  verifyDriverEmail,
} from "../../controllers/DriverController/driver";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post(
  "/adddriver",
  upload.fields([{ name: "driverImage", maxCount: 1 }]),
  addDriver
);

router.put("/verifydriveremail/:token", verifyDriverEmail);
router.post("/driverlogin", driverLogin);
router.get("/getdrivers", getDrivers);
router.get("/getdrivers/:id", getDriverById);

router.put("/updatedriver/:id", updateDriverStatus);
router.delete("/deletedriver/:id", deleteDriver);

export default router;
