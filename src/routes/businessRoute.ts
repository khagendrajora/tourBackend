import express from "express";
import {
  addBusiness,
  businessProfile,
  businessSignOut,
  deleteBusiness,
  featureRequest,
  forgetPwd,
  getBusiness,
  resetPwd,
  updateBusinessProfile,
  verifyEmail,
} from "../controllers/businessController";
import upload from "../middleware/fileUpload";
import { addBusinessData, validation } from "../validation/Validation";
import { verifyAndResetPwd } from "../controllers/userController";

const router = express.Router();

router.post("/addbusiness", addBusinessData, validation, addBusiness);
router.put("/verifybusinessemail/:token", verifyEmail);

router.get("/getbusiness", getBusiness);

router.get("/businessprofile/:businessId", businessProfile);

router.put(
  "/updatebusinessprofile/:businessid",
  upload.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 100 },
  ]),
  updateBusinessProfile
);

router.delete("/deletebusiness/:id", deleteBusiness);
router.post("/businesssignout", businessSignOut);

router.post("/forgetpwd", forgetPwd);
router.put("/resetbusinesspwd/:token", resetPwd);

router.put("/resetandverify/:token", verifyAndResetPwd);

router.post("/requestfeature/:id", featureRequest);

export default router;
