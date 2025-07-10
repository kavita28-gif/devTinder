const express = require("express");

const requestRouter = express.Router();


requestRouter.post("/sendConnectionRequests", async (req, res) => {
    console.log();

    res.send("");
});


module.exports = requestRouter;