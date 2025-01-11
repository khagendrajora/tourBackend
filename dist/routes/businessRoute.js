"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businessController_1 = require("../controllers/businessController");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const Validation_1 = require("../validation/Validation");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post("/addbusiness", Validation_1.addBusinessData, Validation_1.validation, businessController_1.addBusiness);
router.put("/verifybusinessemail/:token", businessController_1.verifyEmail);
router.get("/getbusiness", businessController_1.getBusiness);
router.get("/businessprofile/:businessId", businessController_1.businessProfile);
router.put("/updatebusinessprofile/:businessid", fileUpload_1.default.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 100 },
]), businessController_1.updateBusinessProfile);
router.delete("/deletebusiness/:id", businessController_1.deleteBusiness);
router.post("/businesssignout", businessController_1.businessSignOut);
router.post("/forgetpwd", businessController_1.forgetPwd);
router.put("/resetbusinesspwd/:token", businessController_1.resetPwd);
router.put("/resetandverify/:token", userController_1.verifyAndResetPwd);
router.post("/requestfeature/:id", businessController_1.featureRequest);
exports.default = router;
