import express from "express";
import {
  addAdminUser,
  addBusinessByAdmin,
  adminlogin,
  // adminSignOut,
  businessApprove,
  deleteAdmin,
  forgetPass,
  getAdmin,
  resetPass,
} from "../controllers/userController";
import { adminSignup, validation } from "../validation/Validation";
const router = express.Router();

router.post("/addadmin", adminSignup, validation, addAdminUser);
router.get("/getadmin", getAdmin);
router.put("/businessapprove/:id", businessApprove);
// router.post("/adminsignout", adminSignOut);
router.post("/adminlogin", adminlogin);
router.post("/forgetadminpwd", forgetPass);
router.put("/resetpwd/:token", resetPass);
router.post("/addbusinessbyadmin", addBusinessByAdmin);
router.delete("/deleteadmin/:id", deleteAdmin);

export default router;
