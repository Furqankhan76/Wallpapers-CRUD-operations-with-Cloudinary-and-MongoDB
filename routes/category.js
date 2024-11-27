import { Router } from "express";
import {createCategory,
    getAllCategories,
    getCategoryById,
    catbyname,
deleteCategory,
delallcat} from "../controllers/category.js"

    const router = Router()
router.route("/delall").delete(delallcat)
    router.route('/').get(getAllCategories)
    router.route('/:title').get(catbyname)
    router.route('/:id').get(getCategoryById)
    router.route('/').post(createCategory)
    router.route('/:id').delete(deleteCategory)

    export default router