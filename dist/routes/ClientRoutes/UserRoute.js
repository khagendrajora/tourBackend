"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/Client/userController");
const router = express_1.default.Router();
router.post("/addclient", userController_1.addNewClient);
router.put("/verifyuseremail/:token", userController_1.verifyUserEmail);
router.post("/clientlogin", userController_1.clientLogin);
router.delete("/deleteclient/:id", userController_1.deleteClient);
router.post("/forgotclientpwd", userController_1.forgetPwd);
router.put("/resetclientpwd/:token", userController_1.resetPwd);
exports.default = router;
