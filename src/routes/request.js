const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const status = req.params.status;  // allow only ignored  || interested
        const toUserId = req.params.toUserId;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type: " + status});
        }

        const user = await User.findById(toUserId);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        // check if there is existsing connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({

            $or : [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({message: "Connection request already exists!!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({ message: "Connection request sent successfully!",
            data
        })

    } catch (err) {
        res.status(400).send("Error:"+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const { status, requestId } = req.params;

        const allowedStatus = ["accepted" , "rejected"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status not allowed!"
            })
        } 

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser,
            status: "interested"
        })

        if(!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found!"
            });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request " +status,
            data
        });

    } catch (err) {
        res.status(400).send("Error:"+err.message);
    }

});


module.exports = requestRouter;