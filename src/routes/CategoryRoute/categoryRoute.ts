import express from "express";
import {
  addBusinessCategory,
  addSubCategory,
  addTourCategory,
  addTourSubCategory,
  addTrekCategory,
  addTrekSubCategory,
  addVehicleCategory,
  addVehicleSubCategory,
  deleteBusinessCategory,
  deleteSubCategory,
  deleteTourCategory,
  deleteTrekCategory,
  deleteVehicleCategory,
  getBusinessCategory,
  getBusinessCategoryDetails,
  getTourCategory,
  getTourCategoryDetails,
  getTrekCategory,
  getTrekCategoryDetails,
  getVehicleCategory,
  getVehicleCategoryDetails,
  updateBusinessCategory,
  updateTourCategory,
  updateTrekCategory,
  updateVehicleCategory,
} from "../../controllers/categoryController";
import { addCategoryData, validation } from "../../validation/Validation";

const router = express.Router();
//Business category routes

router.post(
  "/addbusinesscategory",
  addCategoryData,
  validation,
  addBusinessCategory
);
router.get("/getbusinesscategory", getBusinessCategory);
router.delete("/deletebusinesscategory/:id", deleteBusinessCategory);
router.get("/businesscategorydetail/:id", getBusinessCategoryDetails);
router.put("/updatebusinesscategory/:id", updateBusinessCategory);

//business subcategory routes
router.put("/addbuinesssubcategory/:id", addSubCategory);
router.delete("/deletebusinesssubcategory/:id", deleteSubCategory);

//Trek category routes

router.post("/addtrekcategory", addCategoryData, validation, addTrekCategory);
router.get("/gettrekcategory", getTrekCategory);
router.get("/trektcategorydetail/:id", getTrekCategoryDetails);
router.put("/updatetrekcategory/:id", updateTrekCategory);

//Trek subcategory routes
router.put("/addtreksubcategory/:id", addTrekSubCategory);
router.delete("/deletetrekcategory/:id", deleteTrekCategory);

//Tour category routes
router.post("/addtourcategory", addCategoryData, validation, addTourCategory);
router.get("/gettourcategory", getTourCategory);
router.get("/tourcategorydetail/:id", getTourCategoryDetails);
router.put("/updatetourcategory/:id", updateTourCategory);

//Tour subcategory routes
router.put("/addtoursubcategory/:id", addTourSubCategory);
router.delete("/deletetourcategory/:id", deleteTourCategory);

//Vehicle category routes

router.post("/addvehcategory", addCategoryData, validation, addVehicleCategory);
router.get("/getvehiclecategory", getVehicleCategory);
router.get("/vehiclecategorydetail/:id", getVehicleCategoryDetails);
router.put("/updatevehiclecategory/:id", updateVehicleCategory);

//Vehicle subcategory routes
router.put("/addvehiclesubcategory/:id", addVehicleSubCategory);
router.delete("/deletevehiclecategory/:id", deleteVehicleCategory);

export default router;
