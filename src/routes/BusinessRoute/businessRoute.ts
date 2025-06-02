import express from "express";
import {
  activateDriver,
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
} from "../../controllers/BusinessController/businessController";
import upload from "../../middleware/fileUpload";
import { addBusinessData, validation } from "../../validation/Validation";
import { verifyAndResetPwd } from "../../controllers/adminController";
import { veriftyToken } from "../../middleware/Auth";

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
  veriftyToken,
  updateBusinessProfile
);

router.delete("/deletebusiness/:id", veriftyToken, deleteBusiness);
router.post("/businesssignout", businessSignOut);

router.post("/forgetpwd", forgetPwd);
router.put("/resetpassword/:token", resetPwd);

router.put("/resetandverify/:token", verifyAndResetPwd);

router.post("/requestfeature/:id", veriftyToken, featureRequest);

router.put("/activatedriver/:id", veriftyToken, activateDriver);

export default router;
