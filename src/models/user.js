const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type : String,
        required: true,
        minLength: 4,
        maxLength: 100
    },
    lastName: {
        type : String,
        minLength: 4,
        maxLength: 100,
    },
    emailId: {
        type:  String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://ongcvidesh.com/company/board-of-directors/dummy-image/",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("URL is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default description of the user",
        maxLength: 500,
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;