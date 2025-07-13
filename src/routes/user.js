const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");

const userRouter = express.Router();

USER_SAFE_DATA = "firstName lastName about age skills gender";

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)
        .lean();

        // if(!connectionRequests) {
        //     return res.status()
        // }

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        })

    } catch (err) {
        res.status(400).send("Error : "+ err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        //logged i user

        // check in the connect  collection if there are any accepted requests from  { toUserId/ fromUserId: loggedInUser , status: accepted}

        // return the data of only connection

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser, status: "accepted"},
                { toUserId: loggedInUser, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = req.query.page || 1;

        const limit = req.query.limit || 10;

        let skip;

        skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or : [{ fromUserId: loggedInUser }, { toUserId : loggedInUser }]
        }).select("fromUserId toUserId");

        hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        console.log(hideUsersFromFeed);

        const users = await User.find({
           $and : [ 
            { _id : { $nin : Array.from(hideUsersFromFeed)}} ,
            { _id : {$ne: loggedInUser._id}}
           ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.json(users);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = userRouter;