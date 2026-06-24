export type TTickets = {
    id?: number;
    title: string;
    description?: string;
    status: string;
    payment_status: string;
    startdate: Date;
    enddate: Date;
    user_id?: number;
    customer_id?: number;
    type: string;
    estimate_price_text: String,
    estimate_price_photo?: String,
    estimate_price_data?: Buffer;
    billing_price_text: String,
    billing_price_photo?: String,
    billing_price_photo_data?: Buffer;
    actual_price_text: String,
    actual_price_text_two: String,
    actual_price_text_three: String,
    actual_price_photo?: String,
    actual_price_photo_two?: String,
    actual_price_photo_three?: String,
    actual_price_photo_data?: Buffer;
    actual_price_photo_two_data?: Buffer;
    actual_price_photo_three_data?: Buffer;
    actual_price_comment?:string;
    actual_price_two_comment?:string;
    actual_price_three_comment?:string;
    outstanding_price_text: String,
    outstanding_price_photo?: String,
    outstanding_price_photo_data?: Buffer;
    appriciation_one_photo?: String,
    appriciation_one_photo_data?: Buffer;
    appriciation_two_photo?: String,
    appriciation_two_data?: Buffer;
    appriciation_three_photo?: String,
    appriciation_three_photo_data?: Buffer;
    social_media_feedback_photo?: String,
    social_media_feedback_photo_data?: Buffer;

};

