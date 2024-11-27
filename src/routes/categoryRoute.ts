import express from "express";
import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategory,
  getCategoryDetails,
  // getSubCategory,
  // subcategoryDetails,
  updateCategory,
  // updateSubcategory,
} from "../controllers/categoryController";
import { addCategoryData, validation } from "../validation/Validation";

const router = express.Router();

router.post("/addcategory", addCategoryData, validation, addCategory);
router.get("/getcategory", getCategory);
router.delete("/deletecategory/:id", deleteCategory);
router.get("/categorydetail/:id", getCategoryDetails);
router.put("/updatecategory/:id", updateCategory);

router.put(
  "/addsubcategory/:id",

  addSubCategory
);
// router.get("/getsubcategory", getSubCategory);
// router.get("/subcategorydetails/:id", subcategoryDetails);
router.delete("/deletesubcategory/:id", deleteSubCategory);
// router.put("/updatesubcategory/:id", updateSubcategory);

export default router;
