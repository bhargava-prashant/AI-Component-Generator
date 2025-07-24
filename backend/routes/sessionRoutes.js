const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

router.get('/sessions', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const keys = await redisClient.keys(`sess:*`);
  const sessions = [];

  for (const key of keys) {
    const sessionData = await redisClient.get(key);
    if (sessionData.includes(userId)) {
      sessions.push({ key, data: JSON.parse(sessionData) });
    }
  }

  res.json({ sessions });
});

router.post('/sessions/new', isAuthenticated, async (req, res) => {
  // Create new "work" session object and store in Redis or DB
  const sessionId = `work_${Date.now()}`;
  await redisClient.set(sessionId, JSON.stringify({
    userId: req.session.user.id,
    chat: [],
    code: "",
    ui: {}
  }));
  res.json({ sessionId, message: 'New session created' });
});
