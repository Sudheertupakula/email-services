const mongoose = require('mongoose');


const EmailServiceSchema = new mongoose.Schema({
    from_email: {
        type: String,
        required: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ , 'Please enter a valid email'],
    },
    to_email: {
        type: String,
        required: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ , 'Please enter a valid email'],
    },
    scheduled_time: {
        type: Date,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default:new Date()
    },
    last_updated: {
        type: Date,
        allowNull: true
    }
},{collection:"email_services"})

module.exports = mongoose.model("email_services", EmailServiceSchema);