require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Mongoose connected.'))
    .catch(err => console.log('Failed connection with MongoDB.', err));

module.exports = mongoose;
