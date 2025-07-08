const express = require('express');

const app = express();

const { userAuth, adminAuth } = require('./middlewares/auth');

// Error handling

app.get("/getUserData", (req, res) => {
    // try {
        throw new error("Something");
        
    // } catch (err) {
    //     res.status(500).send("Something went wrong in try catch")
    // }
})





// middlewares

app.get("/user/login", (req, res)=> {
    res.send("successfully logged in");
});

app.use("/admin", adminAuth);

app.get("/admin/addUserData", (req, res)=> {
    res.send("Added user data")
});


app.get("/admin/getAllData", (req, res)=> {
    res.send("Got all data");
})


app.get("/admin/deleteData", (req, res) => {
    res.send("deleted data");
})



app.get("/user/addUserData", userAuth, (req, res)=> {
    res.send("Added user data")
});


app.get("/user/getAllData", userAuth, (req, res)=> {
    res.send("Got all data");
})


app.get("/user/deleteData", userAuth, (req, res) => {
    res.send("deleted data");
})

// request handler and middleware

app.use("/", (req, res, next) => { // this is the middleware as this is calling next middleware function
    console.log("any route handler 1"); 
    // res.send("Response 1");
    next();
});
app.use("/afterslash", (req, res, next) => { // this is the request handler as this is sending the response back to the server
    console.log("afterslash handler 2");
    res.send("Response 1");   
    // next();
});


// empty response
app.use("/empty", (req, res) => {

});

// you can create multiple route handlers
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
);


// you can create different routes - it will work exactly same way

app.use("/any", (req, res, next) => {
    console.log("any route handler 1");
    // res.send("Response 1");
    next();
});
app.use("/any", (req, res) => {
    console.log("any route handler 2");
    res.send("Response 2");
});

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Something went wrong")
    }
})



app.listen(4000, ()=> {
    console.log("Server is running on 4000 port");
});
