import express from "express";
import {
  addBusiness,
  // addbusinessProfile,
  businessLogin,
  businessProfile,
  businessSignOut,
  deleteBusiness,
  forgetPwd,
  getBusiness,
  // getBusinessProfile,
  // getBusinessProfileDetails,
  resetPwd,
  updateBusinessProfile,
  verifyEmail,
} from "../controllers/businessController";
import upload from "../middleware/fileUpload";
import {
  addBusinessData,
  // addBusinessProfileData,
  validation,
} from "../validation/Validation";

const router = express.Router();

router.post("/addbusiness", addBusinessData, validation, addBusiness);
router.put("/verifybusinessemail/:token", verifyEmail);
router.post("/businesslogin", businessLogin);
router.get("/getbusiness", getBusiness);

router.get("/businessprofile/:businessId", businessProfile);
// router.get("/businessdata/:id", getBusinessProfileDetails);

// router.post(
//   "/addbusinessprofile/:businessid",
//   upload.fields([
//     { name: "profileIcon", maxCount: 1 },
//     { name: "imageGallery", maxCount: 1000 },
//   ]),
//   addBusinessProfileData,
//   validation,
//   addbusinessProfile
// );
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

// router.get("/getbusinessprofile/:businessId", getBusinessProfile);
router.post("/forgetbusinesspwd", forgetPwd);
router.put("/resetbusinesspwd/:token", resetPwd);

export default router;
