"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import fileUpload from "express-fileupload";
const LandingPage_1 = require("../../controllers/Pages/LandingPage");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const Auth_1 = require("../../middleware/Auth");
const router = express_1.default.Router();
// router.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// Slider
router.post("/addhero", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "heroImage", maxCount: 10 }]), LandingPage_1.addHero);
router.get("/gethero", LandingPage_1.getHero);
router.get("/getherobyid/:id", LandingPage_1.getHeroById);
router.put("/updatehero/:id", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "heroImage", maxCount: 10 }]), LandingPage_1.updateHero);
router.delete("/deletehero/:id", Auth_1.veriftyToken, LandingPage_1.deleteHero);
// Blogs
router.post("/addblogs", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "blogsImage", maxCount: 10 }]), LandingPage_1.addBlogs);
router.get("/getblogs", LandingPage_1.getBlogs);
router.get("/getblogbyid/:id", LandingPage_1.getBlogsById);
router.put("/updateblogs/:id", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "blogsImage", maxCount: 10 }]), LandingPage_1.updateBlogs);
router.delete("/deleteblog/:id", Auth_1.veriftyToken, LandingPage_1.deleteBlogs);
// Destinations
router.post("/addDest", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "destImage", maxCount: 10 }]), LandingPage_1.addDest);
router.get("/getDest", LandingPage_1.getDest);
router.get("/getdestbyid/:id", LandingPage_1.getDestById);
router.put("/updateDest/:id", Auth_1.veriftyToken, fileUpload_1.default.fields([{ name: "destImage", maxCount: 10 }]), LandingPage_1.updateDest);
router.delete("/deletedest/:id", Auth_1.veriftyToken, LandingPage_1.deleteDest);
exports.default = router;
