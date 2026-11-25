const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer disk storage for profile photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/profile — public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile — admin only
router.put('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile/photo — admin only, upload new photo
router.post('/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    
    // Delete old photo if it's a local file
    if (profile.photo && profile.photo.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', profile.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    
    profile.photo = `/uploads/${req.file.filename}`;
    await profile.save();
    res.json({ photo: profile.photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
