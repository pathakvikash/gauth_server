const connection_string = 'mongodb://127.0.0.1:27017/gauth';
const mongoose = require('mongoose');
//localhost:27017/gauth
function connectToDb() {
  mongoose.connect(connection_string);

  mongoose.connection.on('connected', () => {
    console.log('Connection to MongoDB successful');
  });

  mongoose.connection.on('error', () => {
    console.log('An error occured');
  });
}

module.exports = { connectToDb };
