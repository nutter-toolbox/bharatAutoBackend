import mongoose from "mongoose";

const announcementsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: null },
        status: { type: String, default: 'Draft', enum: ['Draft', 'Published'] },
        profile_photo: String,
    },
    { timestamps: true }

);

export const Announcements = mongoose.model("Announcements", announcementsSchema);
