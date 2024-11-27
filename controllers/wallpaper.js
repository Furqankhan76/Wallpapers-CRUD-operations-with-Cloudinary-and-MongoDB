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


// Update a Wp
const updatewp = async (req, res) => {
  try {
    const { id } = req.params;

    const Wp = await wallpaper.findByIdAndUpdate(id, req.body);

    if (!Wp) {
      return res.status(404).json({ message: "Wp not found" });
    }

    const updatedCategory = await category.findById(id);

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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



export { createwp,
  deletewp,updatewp,getWpbyid,getallWP,getwpbyname,deleteAllWallpapers
}

// const wallpapers = await wallpaper.find();
// console.log(wallpapers); // Should show all documents
