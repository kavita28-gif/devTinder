const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Please enter a valid name!!");
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid emailId!!");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!!");
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"];

    const isAllowedFields = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isAllowedFields;
}

module.exports = {
    validateSignupData,
    validateProfileEditData
}