const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,    /// "User" - this can be in string also
        required: true,
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    status : {
        type: String,
        required: true,
        enum : {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1}, { unique: true});


connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }
    next();
});


const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;

