const express = require('express');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const connectDB = require('./config/database');
require("./utils/cronjob");
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);


connectDB()
 .then(() => {
    console.log("Successfully extablished database");
    app.listen(process.env.PORT , ()=> {
        console.log("Server is running on 4000 port");
    });
 })
 .catch((err) => console.error(err));

module.exports.handler = serverless(app);

