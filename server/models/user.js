var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: { type: String },
  login: { type: Boolean, default: false },
  profile_pic: { type: String, default: null }
    }, {
  timestamps: true
});

module.exports = mongoose.model('user', userSchema);