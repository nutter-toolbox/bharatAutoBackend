import * as express from "express";
import { validateBlogBody } from "admin/controllers/blog/blog.validation";
import BlogController from "admin/controllers/blog/blog.contoller"
const router = express.Router()

const { addBlog, getBlogs, getBlog, updateBlog, deleteBlogs } = BlogController

router.post("/", validateBlogBody, addBlog)
router.get("/", getBlogs)
router.get("/:id", getBlog)
router.patch("/:id", updateBlog)
router.delete("/", deleteBlogs)

export default router