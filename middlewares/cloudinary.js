import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import dotenv from "dotenv"
// dotenv.config()
cloudinary.config({
  cloud_name: "dgsld2btg",
  api_key: 562749254723545,
  api_secret: "y5xrsHhGPnWobMigbkaBYDBFPbw",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
   

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      width: 512,
      height: 512,
      crop: "pad",
      // gravity:"face"
    });

    console.log("file is uploaded on cloudinary ", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove the local file in case of an error
    // if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    // }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export  {uploadOnCloudinary};
