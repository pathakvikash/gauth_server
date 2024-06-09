const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const UserImages = mongoose.model('Image', imageSchema);

module.exports = UserImages;
