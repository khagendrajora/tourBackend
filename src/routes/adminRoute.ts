import express from "express";
import {
  addAdminUser,
  addBusinessByAdmin,
  addFeature,
  adminlogin,
  businessApprove,
  deleteAdmin,
  deleteFeatureRequest,
  forgetPass,
  getAdmin,
  getFeature,
  removeFeatureProduct,
  resetPass,
} from "../controllers/userController";
import { adminSignup, validation } from "../validation/Validation";
const router = express.Router();

router.post("/addadmin", adminSignup, validation, addAdminUser);
router.get("/getadmin", getAdmin);
router.put("/businessapprove/:id", businessApprove);

router.post("/adminlogin", adminlogin);
router.post("/forgetadminpwd", forgetPass);
router.put("/resetpwd/:token", resetPass);
router.post("/addbusinessbyadmin", addBusinessByAdmin);
router.delete("/deleteadmin/:id", deleteAdmin);

router.get("/getfeature", getFeature);
router.put("/addfeature/:id", addFeature);
router.delete("/deletefeaturerequest/:id", deleteFeatureRequest);
router.delete("/removefeature/:id", removeFeatureProduct);

export default router;
