import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required:[true, "A blog must contain title"] },
    description: { type: String, required:[true, "A blog must contain description"] },
    status: { type: String, default: "DRAFT", enum: ['draft', 'published'] },
})

export const Blog = mongoose.model("blog", blogSchema)