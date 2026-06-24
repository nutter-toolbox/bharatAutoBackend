import mongoose from 'mongoose';

// Video schema definition
const videoSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true,
    },
    escortid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Escort', 
        required: true
    },
    link: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

// Create the Video model using the schema
export const Video = mongoose.model('Video', videoSchema);