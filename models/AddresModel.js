const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'PollItems._id',
    required: true
  },
  pollID: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Questions', QuestionsSchema);
