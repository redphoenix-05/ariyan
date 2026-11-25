const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

async function notifyTelegram(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    '📩 New Portfolio Message',
    '',
    `From: ${msg.name}`,
    `Email: ${msg.email}`,
    `Subject: ${msg.subject}`,
    '',
    msg.message,
  ].join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });
  } catch (err) {
    console.error('Telegram notify failed:', err.message);
  }
}

// POST /api/messages — public contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const saved = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    await notifyTelegram(saved);
    res.status(201).json({ message: 'Message sent successfully', id: saved._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/messages — admin only
router.get('/', protect, async (req, res) => {
  try {
    const items = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/messages/:id/read — admin only
router.put('/:id/read', protect, async (req, res) => {
  try {
    const read = req.body?.read !== undefined ? Boolean(req.body.read) : true;
    const item = await Message.findByIdAndUpdate(req.params.id, { read }, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/messages/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
