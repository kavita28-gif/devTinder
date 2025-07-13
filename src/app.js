const express = require('express');
const cookieParser = require("cookie-parser");

const connectDB = require('./config/database');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)


connectDB()
 .then(() => {
    console.log("Successfully extablished database");
    app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});
 })
 .catch((err) => console.error(err));


