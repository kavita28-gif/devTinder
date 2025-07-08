const mongoose = require('mongoose');

const url = 'mongodb+srv://kavitakinagi28:egZytI3SEx4hYM0Z@namastenode.ohqhtd0.mongodb.net/devTinder';

const connectDB = async() => {
     await mongoose.connect(url);
};

module.exports = connectDB;

