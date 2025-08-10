const express = require("express");

const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.get("/profile", userAuth,  async (req, res) => {
    try {
    
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error:" + err.message);
    }
});


profileRouter.get("/user", async (req, res) => {

    const emailId = req.body.emailId;
    // console.log(email);

    try {
        const user = await User.findOne({ emailId });
        if(!user) {
            res.status(404).send("User not found");
        } else {
            
            res.send(user);
        }
        
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})

// profileRouter.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find();
//         if(users.length === 0) {
//             res.status(404).send("Users not found");
//         }
//         res.send(users);
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }

// })

profileRouter.delete("/user", async (req, res)=> {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        res.send("Successfully deleted user");

    } catch(err) {
        res.status(500).send("Something went erong")
    }
})


profileRouter.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;

    const allowed_updates = ["photoUrl", "skills", "age", "about" , "gender"];
    const isUpdateAllowed = Object.keys(req.body).every(k => allowed_updates.includes(k));

    try {
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }
        if(req.body.skills?.length >10) {
            throw new Error("Skills can't be more than 10");
        }
        const user = await User.findOneAndUpdate({_id: userId}, req.body, {
            returnDocument: 'after',
            runValidators: true
        }); // bydefault it returns before update data
        res.send(user);
    } catch (err) {
        res.status(400).send("Error updating user" + err.message);
    }

});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateProfileEditData(req)) {
            throw new Error("Invalid edit request!!");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.send({message: `${loggedInUser.firstName}, your profile updated successfully!!`, data: loggedInUser});


    } catch (err) {
        res.status(400).send("Error: " +err);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { newPassword } = req.body;

        if(!validator.isStrongPassword(newPassword)) {
            throw new Error("Please enter a strong password");
        }

        const loggedInUser = req.user;

        loggedInUser.password = await bcrypt.hash(newPassword, 10);

        await loggedInUser.save();

        res.send({message: `${loggedInUser.firstName}, your password updated successfully!!`, data: loggedInUser});


    } catch (err) {
        res.status(400).send("Error: " +err);
    }
});


module.exports = profileRouter;