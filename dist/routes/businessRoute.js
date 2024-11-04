"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businessController_1 = require("../controllers/businessController");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const Validation_1 = require("../validation/Validation");
const router = express_1.default.Router();
router.post("/addbusiness", Validation_1.addBusinessData, Validation_1.validation, businessController_1.addBusiness);
router.post("/verifybusinessemail/:token", businessController_1.verifyEmail);
router.get("/getbusiness", businessController_1.getBusiness);
router.get("/businessprofile/:businessId", businessController_1.businessProfile);
router.get("/businessdata/:id", businessController_1.getBusinessProfileDetails);
router.post("/addbusinessprofile", fileUpload_1.default.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 1000 },
]), Validation_1.addBusinessProfileData, Validation_1.validation, businessController_1.addbusinessProfile);
router.post("/businesslogin", businessController_1.businessLogin);
router.post("/businesssignout", businessController_1.businessSignOut);
router.put("/updatebusinessprofile/:profileId", fileUpload_1.default.fields([
    { name: "profileIcon", maxCount: 1 },
    { name: "imageGallery", maxCount: 100 },
]), businessController_1.updateBusinessProfile);
router.get("/getbusinessprofile/:businessId", businessController_1.getBusinessProfile);
router.post("/forgetbusinesspwd", businessController_1.forgetPwd);
router.put("/resetbusinesspwd/:token", businessController_1.resetPwd);
router.delete("/deletebusiness/:id", businessController_1.deleteBusiness);
exports.default = router;
