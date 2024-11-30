import express from "express";
import {
  addCategory,
  addProductCategory,
  addProductSubCategory,
  addSubCategory,
  deleteCategory,
  deleteProductCategory,
  deleteSubCategory,
  getCategory,
  getCategoryDetails,
  getProductCategory,
  getProductCategoryDetails,
  // getSubCategory,
  // subcategoryDetails,
  updateCategory,
  updateProductCategory,
  // updateSubcategory,
} from "../../controllers/categoryController";
import { addCategoryData, validation } from "../../validation/Validation";

const router = express.Router();

router.post("/addcategory", addCategoryData, validation, addCategory);
router.get("/getcategory", getCategory);
router.delete("/deletecategory/:id", deleteCategory);
router.get("/categorydetail/:id", getCategoryDetails);
router.put("/updatecategory/:id", updateCategory);

router.put("/addsubcategory/:id", addSubCategory);
// router.get("/getsubcategory", getSubCategory);
// router.get("/subcategorydetails/:id", subcategoryDetails);
router.delete("/deletesubcategory/:id", deleteSubCategory);
// router.put("/updatesubcategory/:id", updateSubcategory);

router.post(
  "/addproductcategory",
  addCategoryData,
  validation,
  addProductCategory
);

router.get("/getproductcategory", getProductCategory);
router.get("/productcategorydetail/:id", getProductCategoryDetails);
router.put("/updateProductcategory/:id", updateProductCategory);
router.put("/addproductsubcategory/:id", addProductSubCategory);
router.delete("/deleteproductcategory/:id", deleteProductCategory);

export default router;
