"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LandingPage_1 = require("../../controllers/Pages/LandingPage");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const router = express_1.default.Router();
router.post("/addhero", fileUpload_1.default.fields([{ name: "heroImage", maxCount: 10 }]), LandingPage_1.addHero);
router.get("/gethero", LandingPage_1.getHero);
router.put("/updatehero/:id", fileUpload_1.default.fields([{ name: "heroImage", maxCount: 10 }]), LandingPage_1.updateHero);
router.delete("/deletehero/:id", LandingPage_1.deleteHero);
router.post("/addhotdeals", LandingPage_1.addHotDeals);
router.get("/getaboutus", LandingPage_1.getHotDeals);
router.get("/getdealsbyid/:id", LandingPage_1.getHotDealsById);
router.put("/updateaboutus/:id", LandingPage_1.updateHotdeals);
router.delete("/deleteaboutus/:id", LandingPage_1.deleteHotDeals);
router.post("/addblogs", fileUpload_1.default.fields([{ name: "blogsImage", maxCount: 10 }]), LandingPage_1.addBlogs);
router.get("/getblogs", LandingPage_1.getBlogs);
router.get("/getblogbyid/:id", LandingPage_1.getBlogsById);
router.put("/updateblogs/:id", fileUpload_1.default.fields([{ name: "blogsImage", maxCount: 10 }]), LandingPage_1.updateBlogs);
router.delete("/deleteblog/:id", LandingPage_1.deleteBlogs);
router.post("/addDest", fileUpload_1.default.fields([{ name: "destImage", maxCount: 10 }]), LandingPage_1.addDest);
router.get("/getDest", LandingPage_1.getDest);
router.get("/getdestbyid/:id", LandingPage_1.getDestById);
router.put("/updateDest/:id", fileUpload_1.default.fields([{ name: "destImage", maxCount: 10 }]), LandingPage_1.updateDest);
router.delete("/deletedest/:id", LandingPage_1.deleteDest);
exports.default = router;
