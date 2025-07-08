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

const userAuth = (req, res, next) => {
    console.log("User auth is getting checked");
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyznxsxsj';
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized user");
    } else {
        next();
    }
}


module.exports = {
    userAuth,
    adminAuth
}