const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { func } = require('joi');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
        minlength: 4,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
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

UserSchema.pre('save', async function() {
    const passwordSalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, passwordSalt);
});

UserSchema.methods.comparePassword = async function(password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

module.exports =  mongoose.model('User', UserSchema);