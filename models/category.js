import mongoose, { Schema } from "mongoose"
import wallpaper from "../models/wallpaper.js";

const categoryrschema = new Schema({
  title:{
    type: String,
    required: true,
    unique:true,
  } 
}, {timestamps : true},);

//middleware
categoryrschema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const deletedCount = await wallpaper.deleteMany({ category: this._id });
      console.log(
        `Deleted ${deletedCount.deletedCount} wallpapers for category: ${this._id}`
      );
      next();
    } catch (error) {
      console.error("Error deleting wallpapers:", error);
      next(error);
    }
  }
);


const category = mongoose.model("Category", categoryrschema);
export default category;
