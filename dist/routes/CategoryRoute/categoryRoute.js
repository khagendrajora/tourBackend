"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../../controllers/categoryController");
const Validation_1 = require("../../validation/Validation");
const router = express_1.default.Router();
//Business category routes
router.post("/addbusinesscategory", Validation_1.addCategoryData, Validation_1.validation, categoryController_1.addBusinessCategory);
router.get("/getbusinesscategory", categoryController_1.getBusinessCategory);
router.delete("/deletebusinesscategory/:id", categoryController_1.deleteBusinessCategory);
router.get("/businesscategorydetail/:id", categoryController_1.getBusinessCategoryDetails);
router.put("/updatebusinesscategory/:id", categoryController_1.updateBusinessCategory);
//business subcategory routes
router.put("/addbuinesssubcategory/:id", categoryController_1.addSubCategory);
router.delete("/deletebusinesssubcategory/:id", categoryController_1.deleteSubCategory);
//Trek category routes
router.post("/addtrekcategory", Validation_1.addCategoryData, Validation_1.validation, categoryController_1.addTrekCategory);
router.get("/gettrekcategory", categoryController_1.getTrekCategory);
router.get("/trektcategorydetail/:id", categoryController_1.getTrekCategoryDetails);
router.put("/updatetrekcategory/:id", categoryController_1.updateTrekCategory);
//Trek subcategory routes
router.put("/addtreksubcategory/:id", categoryController_1.addTrekSubCategory);
router.delete("/deletetrekcategory/:id", categoryController_1.deleteTrekCategory);
//Tour category routes
router.post("/addtourcategory", Validation_1.addCategoryData, Validation_1.validation, categoryController_1.addTourCategory);
router.get("/gettourcategory", categoryController_1.getTourCategory);
router.get("/tourcategorydetail/:id", categoryController_1.getTourCategoryDetails);
router.put("/updatetourcategory/:id", categoryController_1.updateTourCategory);
//Tour subcategory routes
router.put("/addtoursubcategory/:id", categoryController_1.addTourSubCategory);
router.delete("/deletetourcategory/:id", categoryController_1.deleteTourCategory);
//Vehicle category routes
router.post("/addvehcategory", Validation_1.addCategoryData, Validation_1.validation, categoryController_1.addVehicleCategory);
router.get("/getvehiclecategory", categoryController_1.getVehicleCategory);
router.get("/vehiclecategorydetail/:id", categoryController_1.getVehicleCategoryDetails);
router.put("/updatevehiclecategory/:id", categoryController_1.updateVehicleCategory);
//Vehicle subcategory routes
router.put("/addvehiclesubcategory/:id", categoryController_1.addVehicleSubCategory);
router.delete("/deletevehiclecategory/:id", categoryController_1.deleteVehicleCategory);
exports.default = router;
