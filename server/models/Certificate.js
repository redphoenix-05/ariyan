const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  badge: { type: String, default: '' },
  team: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
