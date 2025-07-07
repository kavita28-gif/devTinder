const express = require('express');

const app = express();

// app.use("/hello/2", (req, res) => {     // This is a request handler for all routes
//     res.send("Hello2 hello2 hello2");
// });

// app.use("/hello", (req, res) => {     // This is a request handler for all routes
//     res.send("Hello hello hello");
// });



app.get("/user", (req, res) => {
    res.send({"firstName": "Kavita", "lastName": "Kinagi"});
});

app.post("/user", (req, res) => {
    res.send("Successfully insered data to the database");
});

app.put("/user", (req, res) => {
    res.send("Successfully updated user data!");
});

app.delete("/user", (req, res) => {
    res.send("Successfully deleted user data");
});

app.use("/test", (req, res) => {    // This is a request handler for /test
    res.send("This is a test route");
});

app.use("/", (req, res) => {      // This is a request handler for /
    res.send("this is a / route");
});


app.use((req, res) => {
    res.send("This is a base route, other routes won't work")
})

app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});