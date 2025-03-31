import express from "express";
import upload from "../../middleware/fileUpload";
import {
  addBusinessManager,
  getBusinessManager,
  updateBusinessManager,
} from "../../controllers/BusinessController/bManagerController";

const router = express.Router();

router.post(
  "/addmanager",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addBusinessManager
);
router.get("/getmanager/:id", getBusinessManager);

router.put(
  "/updatemanager/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBusinessManager
);

export default router;
