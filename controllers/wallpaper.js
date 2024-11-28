import wallpaper from "../models/wallpaper.js";
import { uploadOnCloudinary } from "../middlewares/cloudinary.js";

const createwp = async (req, res) => {
  try {
    const { title, category, success } = req.body;
    const imageFile = req.file?.path;
// console.log(req.body);
// console.log(imageFile);
// console.log(process.env.CLOUDINARY_API_KEY);


    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });

    }

    const imageUrl = await uploadOnCloudinary(imageFile);
    console.log(imageUrl);
    

    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed"});
    }

        const newWP = await wallpaper.create({
          title,
          category,
          success,
          image: imageUrl.url,
        });


    res.status(201).json(newWP);
  } catch (error) {
    console.error("Error creating wallpaper:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all WP
const getallWP  = async (req,res) => {
    try {
        const  Wp = await wallpaper.find({})
        res.status(200).json(Wp)
    } catch (error) {
            res.status(500).json({ message: error.message });

    }
}

// Get a specific WP by ID
const getWpbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const wp = await wallpaper.findById(id);
    res.status(200).json(wp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//search wp by title
const getwpbyname = async (req, res) =>{
  
  try {
    const { title } = req.params;

    const Wp = await wallpaper.findOne({ title: { $regex: title, $options: 'i' } });

    if (!wallpaper) {
      return res.status(404).json({ message: 'Wp not found' });
    }

    res.status(200).json(Wp);
  } catch (error) {
        res.status(500).json({ message: error.message });
  }
}

//Updating Wallpaper
const updatewp = async (req, res) => {
  try {
    const { title, category, success } = req.body;
    const imageFile = req.file?.path; // Image file from the request
    const { id } = req.params; // ID from URL parameters

    // Retrieve the wallpaper document before updating it, to get the existing image if needed
    const existingWallpaper = await wallpaper.findById(id);
    if (!existingWallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }

    // If an image is uploaded, upload it to Cloudinary, otherwise retain the existing image URL
    const updatedImage = imageFile
      ? await uploadOnCloudinary(imageFile)
      : existingWallpaper.image; // Retain the existing image if no new image is uploaded

    // Update the wallpaper with the new data
    const updatedWallpaper = await wallpaper.findByIdAndUpdate(
      id,
      {
        title,
        category,
        success,
        image: updatedImage.url,
      },
       { new: true } // Return the updated document
    );

    // console.log(updatedWallpaper);
    // console.log(title);
    // console.log(category);
    

    // Check if the wallpaper was successfully updated
    if (!updatedWallpaper) {
      return res.status(404).json({ message: "Wallpaper update failed" });
    }

    // Return the updated wallpaper
    res.status(200).json(updatedWallpaper);
  } catch (error) {
    console.error("Error updating wallpaper:", error);
    res
      .status(500)
      .json({ message: "Error updating wallpaper", error: error.message });
  }
};

//Update a wallpaper 2
const updatewlp = async (req, res) => {
try {
    const {id } = req.params;
        const wp = await wallpaper.findByIdAndUpdate(id, req.body);
  
        if(!wp){
          return res.status(404).json({ message: "task not found" });
        }
          const updatedtask = await wallpaper.findById(id);

          res.status(200).json(updatedtask);
} catch (error) {
      res.status(500).json({ message: error.message });

}

}


// Delete a wp
const deletewp = async (req, res) => {
  try {
    const { id } = req.params;
    const Wp = await wallpaper.findByIdAndDelete(id);
    if (!Wp) {
      return res.status(404).json({ message: "Wp not found" });
    }
    res.status(200).json({ message: "Wp Deleted Successfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all wallpapers
const deleteAllWallpapers = async (req, res) => {
  try {
    // Delete all wallpapers
    const result = await wallpaper.deleteMany({});

    res.status(200).json({
      message: `${result.deletedCount} wallpapers deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting wallpapers:", error);
    res.status(500).json({ message: error.message });
  }
};



//Unsplash
import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

  const unsplash = createApi({
    accessKey: "_ykRQuYxRgR_ZLcsb6C_qm3H_qv_2RJwomppwvWM1Rg",

    fetch: nodeFetch,
  });
// const getresult = async () => {
//   const result = await unsplash.search.getPhotos({
//     query: "",

//     page: 1,

//     perPage: 1,

//     color: "green",

//     orientation: "portrait",
//   });

//   console.log(result);
// };

// getresult();

// const wallpapers = await wallpaper.find();
// console.log(wallpapers); // Should show all documents

// import wallpapers
const importWp = async (req, res) => {
  try {
    // get category and query from req body
const {category, queryb, title } =  req.body;

// console.log(category, title);

// declare an array which is empty name it wallpapers
const wallpapers = []

  const unsplashImages = await unsplash.search.getPhotos({
    query: queryb,
    perPage: 10,
    page: 1,
    orientation: "portrait",
  });

  
  try {
    const results = unsplashImages.response.results;
    results.forEach((result)=>{
      const imageUrl = result.urls.regular;
      const title = result.slug
      // console.log(imageUrl, title);
      const wp = {
        title: title,
        image: imageUrl,
        category: category,
      }
      wallpapers.push(wp)
      
    })
    
    const newWP = await wallpaper.insertMany(wallpapers);
    res.status(201).json(newWP);
  } catch (error) {
    res.status(400).json({message: error.message})
  }

  // console.log(wallpapers)
  // const photo = result.response.results[0];
  // const imgurl = photo.urls.regular
  // const title = result.response.results.find((item) => item.slug)?.slug;
  // // const imageUrl = photo.urls.regular;

  // // console.log(wallpapers);
  // console.log(imgurl);


// const photo = result.response.result[0]
// const imageUrl = photo.urls.regular
// // console.log(wallpapers);
// console.log(imageUrl);


    // use the code to search by query(code in Unsplash.js)


    // get the response.result from the query

    // run a for loop in results

    // inside for loop get title, image

    // append title, image, and category(from req.body) as an object to wallpapers array

    // use insert many and add the wallpapers to store in db

    // send the details stored(outside for loop)


   
  } catch (error) {
    res.status(400).json({message : error.message})
  }
};

export {
  createwp,
  deletewp,
  updatewp,
  getWpbyid,
  getallWP,
  getwpbyname,
  deleteAllWallpapers,
  updatewlp,
  importWp,
};