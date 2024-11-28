import express from "express";
import {
  addBlogs,
  addDest,
  addHero,
  addHotDeals,
  deleteBlogs,
  deleteDest,
  deleteHero,
  deleteHotDeals,
  getBlogs,
  getBlogsById,
  getDest,
  getHero,
  getHotDeals,
  getHotDealsById,
  updateBlogs,
  updateDest,
  updateHero,
  updateHotdeals,
} from "../../controllers/Pages/LandingPage";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post(
  "/addhero",
  upload.fields([{ name: "heroImage", maxCount: 10 }]),
  addHero
);
router.get("/gethero", getHero);
router.put(
  "/updatehero/:id",
  upload.fields([{ name: "heroImage", maxCount: 10 }]),
  updateHero
);
router.delete("/deletehero/:id", deleteHero);

router.post("/addhotdeals", addHotDeals);

router.get("/getaboutus", getHotDeals);
router.get("getdealsbyid/:id", getHotDealsById);

router.put("/updateaboutus/:id", updateHotdeals);

router.delete("/deleteaboutus/:id", deleteHotDeals);

router.post(
  "/addblogs",
  upload.fields([{ name: "blogsImage", maxCount: 10 }]),
  addBlogs
);

router.get("/getblogs", getBlogs);
router.get("/getblogbyid/:id", getBlogsById);

router.put(
  "/updateblogs/:id",
  upload.fields([{ name: "blogsImage", maxCount: 10 }]),
  updateBlogs
);

router.delete("/deleteblog/:id", deleteBlogs);
router.post(
  "/addDest",
  upload.fields([{ name: "destImage", maxCount: 10 }]),
  addDest
);

router.get("/getDest", getDest);

router.put(
  "/updateDest/:id",
  upload.fields([{ name: "destImage", maxCount: 10 }]),
  updateDest
);
router.delete("/deletedest/:id", deleteDest);

export default router;
