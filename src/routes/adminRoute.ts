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
  makePending,
  removeFeatureProduct,
  resetPass,
} from "../controllers/adminController";
import { adminSignup, validation } from "../validation/Validation";
import { veriftyToken } from "../middleware/Auth";
const router = express.Router();

router.post("/addadmin", adminSignup, validation, addAdminUser);
router.get("/getadmin", getAdmin);
router.put("/businessapprove/:id", veriftyToken, businessApprove);

router.post("/adminlogin", adminlogin);
router.post("/forgetadminpwd", forgetPass);
router.put("/resetpwd/:token", resetPass);
router.post("/addbusinessbyadmin", veriftyToken, addBusinessByAdmin);
router.delete("/deleteadmin/:id", veriftyToken, deleteAdmin);

router.get("/getfeature", getFeature);
router.put("/addfeature/:id", veriftyToken, addFeature);
router.delete("/deletefeaturerequest/:id", veriftyToken, deleteFeatureRequest);
router.delete("/removefeature/:id", veriftyToken, removeFeatureProduct);
router.put("/makepending/:id", veriftyToken, makePending);

export default router;
