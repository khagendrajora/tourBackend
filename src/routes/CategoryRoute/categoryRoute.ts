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
import { veriftyToken } from "../../middleware/Auth";

const router = express.Router();
//Business category routes

router.post(
  "/addbusinesscategory",
  addCategoryData,
  validation,
  veriftyToken,
  addBusinessCategory
);
router.get("/getbusinesscategory", getBusinessCategory);
router.delete(
  "/deletebusinesscategory/:id",
  veriftyToken,
  deleteBusinessCategory
);
router.get("/businesscategorydetail/:id", getBusinessCategoryDetails);
router.put("/updatebusinesscategory/:id", veriftyToken, updateBusinessCategory);

//business subcategory routes
router.put("/addbuinesssubcategory/:id", veriftyToken, addSubCategory);
router.delete(
  "/deletebusinesssubcategory/:id",
  veriftyToken,
  deleteSubCategory
);

//Trek category routes

router.post(
  "/addtrekcategory",
  addCategoryData,
  validation,
  veriftyToken,
  addTrekCategory
);
router.get("/gettrekcategory", getTrekCategory);
router.get("/trektcategorydetail/:id", getTrekCategoryDetails);
router.put("/updatetrekcategory/:id", veriftyToken, updateTrekCategory);

//Trek subcategory routes
router.put("/addtreksubcategory/:id", veriftyToken, addTrekSubCategory);
router.delete("/deletetrekcategory/:id", veriftyToken, deleteTrekCategory);

//Tour category routes
router.post(
  "/addtourcategory",
  addCategoryData,
  validation,
  veriftyToken,
  addTourCategory
);
router.get("/gettourcategory", getTourCategory);
router.get("/tourcategorydetail/:id", getTourCategoryDetails);
router.put("/updatetourcategory/:id", veriftyToken, updateTourCategory);

//Tour subcategory routes
router.put("/addtoursubcategory/:id", veriftyToken, addTourSubCategory);
router.delete("/deletetourcategory/:id", veriftyToken, deleteTourCategory);

//Vehicle category routes

router.post(
  "/addvehcategory",
  addCategoryData,
  validation,
  veriftyToken,
  addVehicleCategory
);
router.get("/getvehiclecategory", getVehicleCategory);
router.get("/vehiclecategorydetail/:id", getVehicleCategoryDetails);
router.put("/updatevehiclecategory/:id", veriftyToken, updateVehicleCategory);

//Vehicle subcategory routes
router.put("/addvehiclesubcategory/:id", veriftyToken, addVehicleSubCategory);
router.delete(
  "/deletevehiclecategory/:id",
  veriftyToken,
  deleteVehicleCategory
);

export default router;
