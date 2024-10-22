import express from "express";
import {
  addAboutUs,
  addBlogs,
  addDest,
  addHero,
  getAboutUs,
  getBlogs,
  getDest,
  getHero,
  updateAboutUS,
  updateBlogs,
  updateDest,
} from "../../controllers/Pages/LandingPage";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post(
  "/addhero",
  upload.fields([{ name: "hero_image", maxCount: 10 }]),
  addHero
);
router.get("/gethero", getHero);

router.post("/addaboutus", addAboutUs);

router.get("/getaboutus", getAboutUs);

router.put("/updateaboutus/:id", updateAboutUS);

router.post(
  "/addblogs",
  upload.fields([{ name: "blogs_image", maxCount: 10 }]),
  addBlogs
);

router.get("/getblogs", getBlogs);

router.put("/updateblogs/:id", updateBlogs);

router.post(
  "/addDest",
  upload.fields([{ name: "dest_image", maxCount: 10 }]),
  addDest
);

router.get("/getDest", getDest);

router.put("/updateDest/:id", updateDest);

export default router;
