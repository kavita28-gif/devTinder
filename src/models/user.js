const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY,{
                        expiresIn : "1d"
                    });
    return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;

    const isValidPassword = await bcrypt.compare(passwordByUser, user.password);

    return isValidPassword;
}

const User = mongoose.model("User", userSchema);


module.exports = User;