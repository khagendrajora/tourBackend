"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LandingPage_1 = require("../../controllers/Pages/LandingPage");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const router = express_1.default.Router();
router.post("/addhero", fileUpload_1.default.fields([{ name: "hero_image", maxCount: 10 }]), LandingPage_1.addHero);
router.get("/gethero", LandingPage_1.getHero);
router.post("/addaboutus", LandingPage_1.addAboutUs);
router.get("/getaboutus", LandingPage_1.getAboutUs);
router.put("/updateaboutus/:id", LandingPage_1.updateAboutUS);
router.delete("/deleteaboutus/:id", LandingPage_1.deleteAboutUs);
router.post("/addblogs", fileUpload_1.default.fields([{ name: "blogs_image", maxCount: 10 }]), LandingPage_1.addBlogs);
router.get("/getblogs", LandingPage_1.getBlogs);
router.put("/updateblogs/:id", fileUpload_1.default.fields([{ name: "blogs_image", maxCount: 10 }]), LandingPage_1.updateBlogs);
router.delete("/deleteblog/:id", LandingPage_1.deleteBlogs);
router.post("/addDest", fileUpload_1.default.fields([{ name: "dest_image", maxCount: 10 }]), LandingPage_1.addDest);
router.get("/getDest", LandingPage_1.getDest);
router.put("/updateDest/:id", fileUpload_1.default.fields([{ name: "dest_image", maxCount: 10 }]), LandingPage_1.updateDest);
router.delete("/deletedest/:id", LandingPage_1.deleteDest);
exports.default = router;
