const mongoose = require("mongoose");
const User = require("./user");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    orderId: {
        type : String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    amount : {
        type : Number,
        required: true
    },
    currency: {
        type : String,
        required : true
    },
    receipt: {
        type: String,
        require: true
    }, 
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
        },
        membershipType: {
            type: String,
            enum : {
                values: ["silver", "gold"],
                message: `{VALUE} is incorrect membership type`
            }
        }
    }
}, {
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;