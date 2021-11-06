const mongoose = require('mongoose');

const userGreetingsSchema = new mongoose.Schema({
    hubspot_id: String,
    name: String,
    email: String,
    contact_no: String,
    recipt_url: String,
    verified:{
        type: Boolean,
        default: null
    },
    qr_link: String,
    qa_answer_1: String,
    qa_answer_2: String,
    video_url: String,
    win_status: {
        type: Boolean,
        default: null
    }
}, 
{
    timestamps: true,
});

module.exports= userGreetings = mongoose.model(user_greeting, userGreetingsSchema);