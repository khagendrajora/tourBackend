import express from "express";
import {
  addNewUser,
  changePwd,
  deleteUser,
  getUsers,
  getUserstById,
  resetPwd,
  updateProfileById,
  verifyUserEmail,
} from "../../controllers/User/userController";

const router = express.Router();

router.post("/adduser", addNewUser);
router.put(
  "/updateuser/:id",

  updateProfileById
);
router.put("/changepwd/:id", changePwd);
router.put("/verifyuseremail/:token", verifyUserEmail);
router.get("/getusers", getUsers);

router.get("/getusersbyid/:id", getUserstById);
router.delete("/deleteuser/:id", deleteUser);

router.put("/resetuserpwd/:token", resetPwd);

export default router;
