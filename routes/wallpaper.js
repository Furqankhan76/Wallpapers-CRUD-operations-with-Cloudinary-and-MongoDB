import { Router } from "express";
import multer from "multer";
import {upload}  from "../middlewares/multer.js";
import {  createwp,
  deletewp,updatewp,getWpbyid,getallWP,getwpbyname,deleteAllWallpapers }

  from "../controllers/wallpaper.js"

const router = Router();

router.route("/").post(
  upload.single("image"),
  createwp
);

router.route("/delall").delete(deleteAllWallpapers)
router.route("/all").get(getallWP)
router.route("/:id").get(getWpbyid)
router.route("/:id").delete(deletewp)
router.route("/:id").put(updatewp)
router.route("/search/:title").get(getwpbyname)
// router.route("/delall").delete(deleteAllWallpapers);



export default router