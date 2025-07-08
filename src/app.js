const express = require('express');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user')

app.post("/signup", async (req, res) => {

    const user = new User({
        firstName: "Kavita",
        lastName: "Kinagi",
        emailId: "kavita@kinagi.com",
        password: "kavita123"
    });

    try {
        await user.save();

        res.status(200).send("User added successfully!!");
    } catch (err) {
        res.status(400).send("Something went wrong!!" + err.message);
    }
})

connectDB()
 .then(() => {
    console.log("Successfully extablished database");
    app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});
 })
 .catch((err) => console.error(err));


