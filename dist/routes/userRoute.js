"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Validation_1 = require("../validation/Validation");
const router = express_1.default.Router();
router.post("/addadmin", Validation_1.adminSignup, Validation_1.validation, userController_1.addAdminUser);
router.put("/businessapprove/:id", userController_1.businessApprove);
router.post("/adminsignout", userController_1.adminSignOut);
router.post("/adminlogin", userController_1.adminlogin);
router.post("/forgetpwd", userController_1.forgetPass);
router.put("/resetpwd/:token", userController_1.resetPass);
exports.default = router;
