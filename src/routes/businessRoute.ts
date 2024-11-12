import express from "express";
import {
  addBusiness,
  addbusinessProfile,
  businessLogin,
  businessProfile,
  businessSignOut,
  deleteBusiness,
  forgetPwd,
  getBusiness,
  getBusinessProfile,
  getBusinessProfileDetails,
  resetPwd,
  updateBusinessProfile,
  verifyEmail,
} from "../controllers/businessController";
import upload from "../middleware/fileUpload";
import {
  addBusinessData,
  addBusinessProfileData,
  validation,
} from "../validation/Validation";

const router = express.Router();

router.post("/addbusiness", addBusinessData, validation, addBusiness);
router.put("/verifybusinessemail/:token", verifyEmail);
router.get("/getbusiness", getBusiness);

router.get("/businessprofile/:businessId", businessProfile);
router.get("/businessdata/:id", getBusinessProfileDetails);

router.post(
  "/addbusinessprofile/:businessid",
  upload.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 1000 },
  ]),
  addBusinessProfileData,
  validation,
  addbusinessProfile
);
router.post("/businesslogin", businessLogin);
router.post("/businesssignout", businessSignOut);
router.put(
  "/updatebusinessprofile/:profileId",
  upload.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 100 },
  ]),
  updateBusinessProfile
);

router.get("/getbusinessprofile/:businessId", getBusinessProfile);

router.post("/forgetbusinesspwd", forgetPwd);
router.put("/resetbusinesspwd/:token", resetPwd);
router.delete("/deletebusiness/:id", deleteBusiness);

export default router;
