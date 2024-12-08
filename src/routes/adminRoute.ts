import express from "express";
import {
  addAdminUser,
  adminlogin,
  // adminSignOut,
  businessApprove,
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

export default router;
