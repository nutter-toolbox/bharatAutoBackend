const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    password: String,
    username: String,
    email: String,
    role: { type: String, ref: 'Role', required: false },
    full_name: String,
    contact_number: String,
    country_code: String,
    phone_code: String,
    status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] },
    profile_photo: String,
    address: String,
    city: String,
    state: String,
    country: String,
    last_login_at: String,
    last_login_ip: String,
    refresh_token: String,
    email_code: String,
    email_code_expiry: Date,
    email_verified: Boolean,
    phone_otp_code: String,
    phone_code_expiry: String,
    phone_verified: Boolean,
    password_reset_code: String,
    password_reset_expiry: String,
    timezone: String,
    is_agreed: Boolean,
    profile_description: String,
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets'
    }],

}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);



