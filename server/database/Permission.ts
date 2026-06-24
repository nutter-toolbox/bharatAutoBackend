import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: null },
        active: { type: Boolean, required: true, default: true },
    },
    {
        collection: "permissions",
        timestamps: true,
    }
);

export const Permission = mongoose.model("Permission", permissionSchema);
