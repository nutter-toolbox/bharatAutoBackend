import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone_code: String,
  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  company: {
    type: String,
    required: false,
    trim: true
  },
  source: {
    type: String,
    required: true,
    enum: ['Website', 'Referral', 'Social Media', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'In Progress', 'Contacted', 'Converted', 'Rejected'],
    default: 'New'
  },
  comment: {
    type: String,
    trim: true
  }
 
}, { timestamps: true }
);

export const Leads = mongoose.model('Leads', leadSchema);
