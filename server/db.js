require('dotenv').config();
let connection_string = `${process.env.DATABASE_URI}`;
const mongoose = require('mongoose');

function connectToDb() {
  mongoose.connect(process.env.DATABASE_URI);

  mongoose.connection.on('connected', () => {
    console.log('Connection to MongoDB successful');
  });

  mongoose.connection.on('error', () => {
    console.log('An error occured');
  });
}

module.exports = { connectToDb };
