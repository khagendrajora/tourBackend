"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/User/userController");
const router = express_1.default.Router();
router.post("/adduser", userController_1.addNewUser);
router.put("/updateuser/:id", userController_1.updateProfileById);
router.put("/changepwd/:id", userController_1.changePwd);
router.put("/verifyuseremail/:token", userController_1.verifyUserEmail);
router.get("/getusers", userController_1.getUsers);
router.get("/getusersbyid/:id", userController_1.getUserstById);
router.delete("/deleteuser/:id", userController_1.deleteUser);
router.put("/resetuserpwd/:token", userController_1.resetPwd);
exports.default = router;
