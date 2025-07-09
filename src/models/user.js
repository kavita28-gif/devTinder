const mongoose = require('mongoose');

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
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100,
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
    phptoUrl: {
        type: String,
        default: "https://ongcvidesh.com/company/board-of-directors/dummy-image/",
        
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