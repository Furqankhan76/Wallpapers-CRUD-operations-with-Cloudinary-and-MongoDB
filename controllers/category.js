import category from "../models/category.js"
import wallpaper from "../models/wallpaper.js";

// Create  a new category
const createCategory = async (req, res) => {
  try {
    const Category = await category.create(req.body);
    res.status(200).json(Category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
const getAllCategories  = async (req,res) => {
    try {
        const  fk = await category.find({})
        res.status(200).json(fk)
    } catch (error) {
            res.status(500).json({ message: error.message });

    }
}

// Get a specific category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await category.findById(id);
    res.status(200).json(Category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//find category by name
const catbyname = async (req, res) => {
  try {
    const { title } = req.params;

    const Category = await category.findOne({ title: new RegExp(title, 'i') });

    if (!Category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(Category);
  } catch (error) {
    res.status(500).json({ message:   error.message});
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const categoryToDelete = await category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Use .remove() to trigger the pre('remove') middleware
    await categoryToDelete.deleteOne();

    res.status(200).json({ message: "Category and associated wallpapers deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
};


//del all cat with wallpapers
const delallcat = async (req, res) => {
  try {
    // Find categories (consider filtering and projection)
    const categories = await category.find({}, { _id: 1 }); // Select only _id for efficiency

    // Check if categories exist before deletion
    if (categories.length === 0) {
      return res
        .status(204)
        .json({ message: "No categories found for deletion" });
    }

    const categoryIds = categories.map((cat) => cat._id);

    // Delete associated wallpapers in batches (for large datasets)
    const batchSize = 1000; // Adjust based on database and performance needs
    let deletedWallpapers = 0;
    for (let i = 0; i < categoryIds.length; i += batchSize) {
      const slice = categoryIds.slice(i, i + batchSize);
      const deletedCount = await wallpaper.deleteMany({
        category: { $in: slice },
      });
      deletedWallpapers += deletedCount.deletedCount;
    }
    console.log(`${deletedWallpapers} wallpapers deleted`);

    // Delete categories
    const categoryResult = await category.deleteMany({});
    console.log(`${categoryResult.deletedCount} categories deleted`);

    res.status(200).json({
      message: `${categoryResult.deletedCount} categories and ${deletedWallpapers} wallpapers deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting categories and wallpapers:", error);
    res.status(500).json({ message: "Internal server error" }); // Avoid exposing error details
  }
};


export{createCategory,
    getAllCategories,
    getCategoryById,
    catbyname,
    deleteCategory,
    delallcat
}
