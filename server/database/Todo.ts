import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    title: { type: String, required: [true, "A todo must have description"], trim: true },
    status: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "A todo must have userId"] }
})

export const Todo = mongoose.model("todo", todoSchema)