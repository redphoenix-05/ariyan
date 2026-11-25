const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Ariyan Aftab' },
  title: { type: String, default: 'Full-Stack Developer & CSE Student' },
  bio: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  quickFacts: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
  }],
  photo: { type: String, default: '' }, // URL or base64
  email: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
  location: { type: String, default: 'Khulna, Bangladesh' },
  resumeUrl: { type: String, default: '' },
  skillCategories: [{
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    items: [{ type: String }],
  }],
  skills: [{ type: String }],
  seoKeywords: { type: String, default: 'Ariyan Aftab, portfolio, developer, KUET, CSE' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
