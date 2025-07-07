const express = require('express');

const app = express();

// app.use((req, res) => {     // This is a request handler for all routes
//     res.send("This is request handler");
// });



app.use("/test", (req, res) => {    // This is a request handler for /test
    res.send("This is a test route");
})

app.use("/", (req, res) => {      // This is a request handler for /
    res.send("this is a / route");
})

app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});