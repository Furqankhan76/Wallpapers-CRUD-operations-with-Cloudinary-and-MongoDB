import mongoose, {Schema} from "mongoose"

const wallpaperschema = new Schema(
  {
   
    title:{
        type:String,
        unique:false,
        required:true
    },
success: {
    type: Boolean,
    default: true
  } , 
    image: {
      type: String, //cloudinary url
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

 const wallpaper = mongoose.model("Wallpaper", wallpaperschema);
  export default wallpaper