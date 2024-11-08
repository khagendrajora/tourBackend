import express from "express";
import {
  addNewClient,
  clientLogin,
  deleteClient,
  forgetPwd,
  resetPwd,
  verifyUserEmail,
} from "../../controllers/Client/userController";

const router = express.Router();

router.post("/addclient", addNewClient);
router.put("/verifyuseremail/:token", verifyUserEmail);
router.post("/clientlogin", clientLogin);
router.delete("/deleteclient/:id", deleteClient);
router.post("/forgotclientpwd", forgetPwd);
router.put("/resetclientpwd/:token", resetPwd);

export default router;
