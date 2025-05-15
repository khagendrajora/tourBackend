import express from "express";
// import fileUpload from "express-fileupload";
import {
  addBlogs,
  addDest,
  addHero,
  deleteBlogs,
  deleteDest,
  deleteHero,
  getBlogs,
  getBlogsById,
  getDest,
  getDestById,
  getHero,
  getHeroById,
  updateBlogs,
  updateDest,
  updateHero,
} from "../../controllers/Pages/LandingPage";
import upload from "../../middleware/fileUpload";
import { veriftyToken } from "../../middleware/Auth";

const router = express.Router();

// router.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// Slider

router.post(
  "/addhero",
  veriftyToken,
  upload.fields([{ name: "heroImage", maxCount: 10 }]),
  addHero
);
router.get("/gethero", getHero);
router.get("/getherobyid/:id", getHeroById);
router.put(
  "/updatehero/:id",
  veriftyToken,
  upload.fields([{ name: "heroImage", maxCount: 10 }]),
  updateHero
);
router.delete("/deletehero/:id", veriftyToken, deleteHero);

// Blogs
router.post(
  "/addblogs",
  veriftyToken,
  upload.fields([{ name: "blogsImage", maxCount: 10 }]),
  addBlogs
);

router.get("/getblogs", getBlogs);
router.get("/getblogbyid/:id", getBlogsById);

router.put(
  "/updateblogs/:id",
  veriftyToken,
  upload.fields([{ name: "blogsImage", maxCount: 10 }]),
  updateBlogs
);

router.delete("/deleteblog/:id", veriftyToken, deleteBlogs);

// Destinations
router.post(
  "/addDest",
  veriftyToken,
  upload.fields([{ name: "destImage", maxCount: 10 }]),
  addDest
);

router.get("/getDest", getDest);
router.get("/getdestbyid/:id", getDestById);

router.put(
  "/updateDest/:id",
  veriftyToken,
  upload.fields([{ name: "destImage", maxCount: 10 }]),
  updateDest
);
router.delete("/deletedest/:id", veriftyToken, deleteDest);

export default router;
