const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { generateReceiptId } = require("../utils/helper");  
const Payment = require("../models/payment");
const { membershipAmount, currency } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { _id, firstName, lastName, emailId } = req.user;
        const receiptId = generateReceiptId();

        const options = {
            "amount": membershipAmount[membershipType] * 100,
            "currency": currency,
            "receipt": receiptId,
            "notes": {
              firstName,
              lastName,
              emailId,
              membershipType
            }
        }
        const order = await razorpayInstance.orders.create(options);

        const payment = new Payment({
            userId: _id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();
        
        res.status(200).json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
});


paymentRouter.post("/payment/webhook", async (req, res) => {
    try {

        console.log("Webhook called");
        const webhookSignature = req.get("X-Razorpay-Signature");
        console.log("Webhook signature received");

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), 
                                 webhookSignature, 
                                 process.env.RAZORPAY_WEBHOOK_SECRET);
        console.log("Webhook called");
        
        if (!isWebhookValid) {
            return res.status(400).json({"message":  "Webhook is invalid"});
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId : paymentDetails.order_id});

        payment.paymentId = paymentDetails.id ? paymentDetails.id : null;
        payment.status = paymentDetails.status;
        await payment.save();
        console.log("payment saved");

        if(req.body.event === "payment.captured") {

           const user = await User.findById({_id: payment.userId});
           user.isPremium = true;
           user.membership = payment.notes.membershipType;
           await user.save();
           console.log("User saved");
        }

        // if(req.body.event === "payment.failed") {
            
        // }
        return res.status(200).json({"message":  "Webhook received successfully"})
        
    } catch(err) {
        return res.status(500).json({"message":  err.message})
    }

});

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
    try {
        const user = req.user.toJSON();

        if(user.isPremium) {
            return res.status(200).json({isPremium : true});
        }
        return res.status(200).json({isPremium : false});
    } catch(err) {
        return res.status(500).json({"message":  err.message})
    }
});


module.exports = paymentRouter;