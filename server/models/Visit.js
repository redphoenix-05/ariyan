const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 },
  uniqueVisitors: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
