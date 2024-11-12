const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://ahmedshahid:rD1Ppb600wo1GVsM@cluster0.vimbn.mongodb.net/yourDatabaseName?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Mongoose connected.'))
    .catch(err => console.log('Failed connection with MongoDB.', err))

module.exports = mongoose;