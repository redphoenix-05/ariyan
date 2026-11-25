const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, default: 'Full-time' }, // Full-time, Part-time, Internship, Freelance
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null }, // null = current
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  location: { type: String, default: '' },
  technologies: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual: duration string
experienceSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = this.isCurrent ? new Date() : new Date(this.endDate);
  const diffMs = end - start;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  
  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  if (parts.length === 0 && days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  return parts.join(' ') || 'Less than a day';
});

experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Experience', experienceSchema);
