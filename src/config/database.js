const mongoose = require('mongoose');

const url = process.env.DB_CONNECTION;

const connectDB = async() => {
     await mongoose.connect(url);
};

module.exports = connectDB;

