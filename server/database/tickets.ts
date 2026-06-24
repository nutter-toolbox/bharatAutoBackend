import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: null },
        status: { type: String, default: 'pending', enum: ['pending', 'completed', 'In Progress', 'hold'] },
        type:{ type: String, default: 'enquiry', enum: ['enquiry', 'sale', 'service'] },
        startdate: {
            type: String,
            allowNull: true,
            required: false
        },
        userid: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        enddate: {
            type: String,
            allowNull: true,
            required: false
        },
        estimate_price_text: String,
        estimate_price_photo: String,
        billing_price_text: String,
        billing_price_photo: String,
        actual_price_text: String,
        actual_price_photo: String,
        actual_price_text_two: String,
        actual_price_photo_two: String,
        actual_price_text_three: String,
        actual_price_photo_three: String,
        outstanding_price_text: String,
        outstanding_price_photo: String,
        appriciation_one_photo: String,
        appriciation_two_photo: String,
        appriciation_three_photo: String,
        social_media_feedback_photo: String,
        
       

    },
    { timestamps: true }

);

export const Tickets = mongoose.model("Tickets", ticketsSchema);
