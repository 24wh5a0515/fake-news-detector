const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  newsText: {
    type: String,
    required: true
  },
  result: {
    type: String,        // "REAL" or "FAKE"
    required: true
  },
  confidenceScore: {
    type: String,        // Example: "85%"
    required: true
  },
  reason: {
    type: String,        // AI explanation
    required: true
  },
  checkedAt: {
    type: Date,
    default: Date.now    // Auto saves current time
  }
});

module.exports = mongoose.model('News', newsSchema);