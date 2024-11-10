import express from "express";
import {
  addNewClient,
  clientLogin,
  deleteClient,
  forgetPwd,
  getClientById,
  resetPwd,
  updateProfileById,
  verifyUserEmail,
} from "../../controllers/Client/userController";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post(
  "/addclient",
  upload.fields([{ name: "userImage", maxCount: 1 }]),
  addNewClient
);
router.put(
  "/updateclient/:id",
  upload.fields([{ name: "userImage", maxCount: 1 }]),
  updateProfileById
);
router.put("/verifyuseremail/:token", verifyUserEmail);
router.post("/clientlogin", clientLogin);
router.get("/getclientbyid/:id", getClientById);
router.delete("/deleteclient/:id", deleteClient);
router.post("/forgotclientpwd", forgetPwd);
router.put("/resetclientpwd/:token", resetPwd);

export default router;
