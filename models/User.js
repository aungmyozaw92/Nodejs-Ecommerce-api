const mongoose = require('mongoose');

const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
        minlength: 4,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
        validate: {
            validator: validator.isEmail,
            message: 'Please enter valid email'
        },
        minlength: 6,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

module.exports =  mongoose.model('User', UserSchema);