const express = require('express');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {
    // creating a new instance of user model
    console.log(req.body);

    const user = new User(req.body);

    try {
        await user.save();
        res.status(200).send("User added successfully!!");
    } catch (err) {
        res.status(400).send("Error saving user" + err.message);
    }
});

app.get("/user", async (req, res) => {

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

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        if(users.length === 0) {
            res.status(404).send("Users not found");
        }
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }

})

app.delete("/user", async (req, res)=> {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        res.send("Successfully deleted user");

    } catch(err) {
        res.status(500).send("Something went erong")
    }
})


app.patch("/user", async (req, res) => {
    const userId = req.body._id;

    try {
        const user = await User.findOneAndUpdate({_id: userId}, req.body, {
            returnDocument: 'after',
            runValidators: true
        }); // bydefault it returns before update data
        res.send(user);
    } catch (err) {
        res.status(400).send("Error updating user" + err.message);
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


