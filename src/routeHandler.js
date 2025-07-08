const express = require('express');

const app = express();

// empty response
app.use("/empty", (req, res) => {

});


app.use("/user",
    [(req, res, next) => {
        console.log('Handling 1st route user');
        next();
        //res.send("1st Response");
    },
    (req, res, next) => {
        console.log('Handling 2nd route user');
        //res.send("2nd Response");
        next();
    },
    (req, res, next) => {
        console.log('Handling 3rd route user');
        // res.send("3rd Response");
        next();
    },
    (req, res, next) => {
        console.log('Handling 4th route user');
        // res.send("4th Response");
        next();
    },
    (req, res, next) => {
        console.log('Handling 5th route user');
        res.send("5th Response");
        // next();
    }],
)

app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});
