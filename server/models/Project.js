const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  liveUrl: { type: String, default: '' }, // empty = don't show
  githubUrl: { type: String, default: '' },
  technologies: [{ type: String }],
  category: { type: String, default: 'Web' }, // Web, AI/ML, Mobile, etc.
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, default: 'completed' }, // completed, ongoing, archived
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
