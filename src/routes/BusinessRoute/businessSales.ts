import express from "express";
import upload from "../../middleware/fileUpload";
import {
  addSales,
  getBusinessSales,
  updateBusinessSales,
} from "../../controllers/BusinessController/salesController";

const router = express.Router();

router.post(
  "/addsales",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addSales
);
router.get("/getsales/:id", getBusinessSales);

router.put(
  "/updatesales/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBusinessSales
);

export default router;
