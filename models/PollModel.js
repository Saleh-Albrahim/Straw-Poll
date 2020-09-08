const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const PollSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: {
    type: String,
    required: true
  },
  options: [{
    _id: {
      type: String,
      default: shortid.generate
    },
    name: {
      type: String,
      required: true
    },
    voteCount: {
      type: Number,
      default: 0
    }
  }],
  ipAddress: {
    type: Boolean,
    required: false,
    default: false
  },
  hidden: {
    type: Boolean,
    required: false,
    default: false
  },
  vpn: {
    type: Boolean,
    required: false,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Get the total vote number 
PollSchema.methods.getTotalVotes = async function () {
  let totalVote = 0;
  this.options.forEach(option => {
    totalVote += option.voteCount;
  });
  this.total = totalVote;
};

// Add percentage to each option
PollSchema.methods.addPercentageToOptions = async function () {
  this.options.forEach(option => {
    option.percentage = (option.voteCount / this.total) * 100;
    if (!isFinite(option.percentage)) {
      option.percentage = 0;
    } else if (!Number.isInteger(option.percentage)) {
      option.percentage = option.percentage.toFixed(2);
    }
  });
};

// Create Address collections when poll created 
PollSchema.post('save', async function (next) {
  await this.model('Address').create({ _id: this._id });
  next();
});

// Cascade delete IpAddress when a poll is deleted
PollSchema.pre('remove', async function (next) {
  await this.model('Address').deleteMany({ _id: this._id });
  next();
});


// Reverse populate with virtuals
PollSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: '_id',
  justOne: false
});



module.exports = mongoose.model('Polls', PollSchema);
