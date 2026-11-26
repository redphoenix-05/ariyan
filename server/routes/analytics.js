const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Message = require('../models/Message');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');

function getLocalDateKey(offsetDays = 0) {
  // Asia/Dhaka (UTC+6) so "Today" matches local day cleanly
  const now = new Date(Date.now() + 6 * 60 * 60 * 1000 - offsetDays * 24 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

// POST /api/analytics/visit — public lightweight visit tracker
router.post('/visit', async (req, res) => {
  try {
    const date = getLocalDateKey(0);
    const visitorId = typeof req.body?.visitorId === 'string'
      ? req.body.visitorId.slice(0, 64)
      : '';

    const update = { $inc: { count: 1 } };
    if (visitorId) {
      update.$addToSet = { uniqueVisitors: visitorId };
    }

    await Visit.findOneAndUpdate(
      { date },
      update,
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/overview — admin only
router.get('/overview', protect, async (req, res) => {
  try {
    const todayKey = getLocalDateKey(0);
    const last7Keys = Array.from({ length: 7 }, (_, i) => getLocalDateKey(6 - i));

    const [
      allVisits,
      unreadMessages,
      totalMessages,
      recentMessages,
      projectsCount,
      certificatesCount,
      educationCount,
      experienceCount,
    ] = await Promise.all([
      Visit.find().lean(),
      Message.countDocuments({ read: false }),
      Message.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(3).lean(),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Education.countDocuments(),
      Experience.countDocuments(),
    ]);

    const visitMap = new Map(allVisits.map(v => [v.date, v]));
    const todayDoc = visitMap.get(todayKey);
    const totalVisits = allVisits.reduce((sum, v) => sum + (v.count || 0), 0);

    const last7Days = last7Keys.map(key => {
      const doc = visitMap.get(key);
      return {
        date: key,
        label: key.slice(5), // MM-DD
        count: doc?.count || 0,
        unique: doc?.uniqueVisitors?.length || 0,
      };
    });

    res.json({
      today: {
        date: todayKey,
        visits: todayDoc?.count || 0,
        unique: todayDoc?.uniqueVisitors?.length || 0,
      },
      totalVisits,
      last7Days,
      messages: {
        unread: unreadMessages,
        total: totalMessages,
        recent: recentMessages,
      },
      counts: {
        projects: projectsCount,
        certificates: certificatesCount,
        education: educationCount,
        experience: experienceCount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
