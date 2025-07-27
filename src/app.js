const express = require('express');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');



const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        credetials: true,
    })
)

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
    app.listen(process.env.PORT , ()=> {
    console.log("Server is running on 4000 port");
});
 })
 .catch((err) => console.error(err));


