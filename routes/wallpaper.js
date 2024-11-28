import { Router } from "express";
import multer from "multer";
import {upload}  from "../middlewares/multer.js";
import {  createwp,
  deletewp,updatewp,getWpbyid,getallWP,getwpbyname,deleteAllWallpapers, 
  updatewlp,
  importWp}

  from "../controllers/wallpaper.js"

const router = Router();
router.route("/").post(upload.single("image"), createwp);

router.route("/import").post(
  importWp
);

router.route("/delall").delete(deleteAllWallpapers)
router.route("/all").get(getallWP)
router.route("/:id").get(getWpbyid)
router.route("/:id").delete(deletewp)
router.route("/another/:id").put(upload.single("image"), updatewlp);
router.route("/:id").put(upload.single("image"), updatewp);
router.route("/search/:title").get(getwpbyname)
// router.route("/delall").delete(deleteAllWallpapers);



export default router