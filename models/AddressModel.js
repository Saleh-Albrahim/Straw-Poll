const mongoose = require('mongoose');
const ms = require('ms');
const AddressSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  pollID: {
    type: String,
    ref: 'Polls._id',
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '5m' },
  },

});


module.exports = mongoose.model('Address', AddressSchema);
