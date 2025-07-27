const jwt = require("jsonwebtoken");
const User = require("../models/user");



const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyzncsjkn';
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized admin");
    } else {
        next();
    }
}

const userAuth = async (req, res, next) => {
    try {
        // read the token
        const cookies = req.cookies;

        const { token } = cookies;

        if(!token) {
            throw new Error("Invalid Token!");
        }

        const isTokenValid = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { _id } = isTokenValid;

        const user = await User.findById(_id);

        if(!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch(err) {
        res.status(401).send("Error:"+ err.message)
    }

}


module.exports = {
    userAuth,
    adminAuth
}