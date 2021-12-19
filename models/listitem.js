const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Participant'
  }]
})

const Item = mongoose.model('item', itemSchema);

module.exports = Item;