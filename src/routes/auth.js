const express = require("express");

const bcrypt = require('bcrypt');
const validator = require('validator');

const { validateSignupData } = require('../utils/validation');

const User = require('../models/user');

const authRouter = express.Router();


authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if(!validator.isEmail(emailId)) {
            throw new Error("invalid email id");
        }

        const user = await User.findOne({emailId});

        if(!user) {
            throw new Error("Invalid credentials!!");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT();

            res.cookie("token", token, 
                { expires: new Date(Date.now() + 8 * 3600000) });  // 8 hours

            res.send("Login successful");
        } else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(400).send("Error:" + err.message);
    }
})

authRouter.post("/signup", async (req, res) => {
    // creating a new instance of user model
    // console.log(req.body);

    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });
        await user.save();
        res.status(200).send("User added successfully!!");
    } catch (err) {
        res.status(400).send("Error:" + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {

    res.cookie("token", null , {
        expires: new Date(Date.now())
    });

    res.send("Logged out successfully!!");

});


module.exports = authRouter;