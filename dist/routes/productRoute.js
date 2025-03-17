"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import fileUpload from "express-fileupload";
const productController_1 = require("../controllers/productController");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = express_1.default.Router();
// router.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// Tour Routes
router.post("/addtour", productController_1.addTour);
router.get("/gettour", productController_1.getTour);
router.get("/gettourdetails/:id", productController_1.tourDetails);
router.get("/gettour/:businessid", productController_1.getTourByBusinessId);
router.put("/updatetour/:id", 
// upload.fields([{ name: "tourImages", maxCount: 1000 }]),
productController_1.updateTour);
// Trek Routes
router.post("/addtrek", fileUpload_1.default.fields([{ name: "trekImages", maxCount: 1000 }]), productController_1.addTrek);
router.get("/gettrek", productController_1.getTrek);
router.get("/gettrek/:businessid", productController_1.getTrekByBusinessId);
router.get("/gettrekdetails/:id", productController_1.trekDetails);
router.put("/updatetrek/:id", fileUpload_1.default.fields([{ name: "trekImages", maxCount: 1000 }]), productController_1.updateTrek);
// Venicle Routes
router.post("/addveh", fileUpload_1.default.fields([{ name: "vehImages", maxCount: 1000 }]), productController_1.addVehicle);
router.get("/getveh", productController_1.getVeh);
router.get("/getvehicle/:businessid", productController_1.getVehicleByBusinessId);
router.get("/getvehdetails/:id", productController_1.vehDetails);
router.put("/updateveh/:id", fileUpload_1.default.fields([{ name: "vehImages", maxCount: 1000 }]), productController_1.updateVeh);
router.delete("/deleteprod/:id", productController_1.deleteproduct);
exports.default = router;
