import express from "express";
import {
  addProperty,
  deleteProperty,
  getProperty,
  propertyDetails,
  updateProperty,
} from "../controllers/propertyController";
import { addPropertyData, validation } from "../validation/Validation";

const router = express.Router();

router.post("/addproperty", addPropertyData, validation, addProperty);
router.get("/getproperty", getProperty);
router.get("/propertydetails/:id", propertyDetails);
router.put("/updateproperty/:id", updateProperty);
router.delete("/deleteproperty/:id", deleteProperty);

export default router;
