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

router.post("/addbusinesscategory", addCategoryData, validation, addBusinessCategory);
router.get("/getbusinesscategory", getBusinessCategory);
router.delete("/deletebusinesscategory/:id", deleteBusinessCategory);
router.get("/businesscategorydetail/:id", getBusinessCategoryDetails);
router.put("/updatebusinesscategory/:id", updateBusinessCategory);
router.put("/addbuinesssubcategory/:id", addSubCategory);
router.delete("/deletebusinesssubcategory/:id", deleteSubCategory);

router.post(
  "/addtrekcategory",
  addCategoryData,
  validation,
  addTrekCategory
);
router.get("/gettrekcategory", getTrekCategory);
router.get("/trektcategorydetail/:id", getTrekCategoryDetails);
router.put("/updatetrekcategory/:id", updateTrekCategory);
router.put("/addtreksubcategory/:id", addTrekSubCategory);
router.delete("/deletetrekcategory/:id", deleteTrekCategory);


router.post(
  "/addtourcategory",
  addCategoryData,
  validation,
  addTourCategory
);
router.get("/gettourcategory", getTourCategory);
router.get("/tourcategorydetail/:id", getTourCategoryDetails);
router.put("/updatetourcategory/:id", updateTourCategory);
router.put("/addtoursubcategory/:id", addTourSubCategory);
router.delete("/deletetourcategory/:id", deleteTourCategory);


router.post(
  "/addvehcategory",
  addCategoryData,
  validation,
  addVehicleCategory
);
router.get("/getvehiclecategory", getVehicleCategory);
router.get("/vehiclecategorydetail/:id", getVehicleCategoryDetails);
router.put("/updatevehiclecategory/:id", updateVehicleCategory);
router.put("/addvehiclesubcategory/:id", addVehicleSubCategory);
router.delete("/deletevehiclecategory/:id", deleteVehicleCategory);

export default router;
