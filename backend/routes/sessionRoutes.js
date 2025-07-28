const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient');
const SessionModel = require('../models/Sessions');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Helper function to generate consistent session ID
const generateSessionId = (userId) => {
  return `${userId}_${uuidv4()}`;
};

// Helper function to get Redis key for session
const getSessionKey = (userId, sessionId) => {
  return `app_sess_user_${userId}_${sessionId}`;
};

// GET all sessions + prepend a fresh temporary session
router.get('/sessions', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id?.toString();

    if (!userId) {
      console.log('❌ User ID not found in req.user:', req.user);
      return res.status(401).json({ message: 'User ID not found in session' });
    }

    console.log('🔍 Searching for APPLICATION sessions for user ID:', userId);
    let sessions = [];

    // Try Redis first - look for app sessions, not auth sessions
    const keys = await redisClient.keys(`app_sess_user_${userId}_*`);
    console.log('🔍 Redis APPLICATION session keys found:', keys);

    if (keys.length > 0) {
      console.log('📦 Found APPLICATION sessions in Redis:', keys.length);
      const promises = keys.map(async (key) => {
        try {
          const sessionData = await redisClient.get(key);
          return sessionData ? JSON.parse(sessionData) : null;
        } catch (parseError) {
          console.error('❌ Error parsing Redis session data:', parseError);
          return null;
        }
      });

      const redisResults = await Promise.all(promises);
      sessions = redisResults.filter(session => session !== null);
    } else {
      console.log('❌ No Redis APPLICATION sessions found. Fetching from MongoDB...');
      // Fallback to MongoDB
      sessions = await SessionModel.find({ userId }).sort({ updatedAt: -1 });

      // Cache MongoDB results in Redis with correct prefix
      if (sessions.length > 0) {
        const cachePromises = sessions.map(session =>
          redisClient.setex(
            getSessionKey(userId, session._id),
            86400, // 24 hours
            JSON.stringify(session)
          )
        );
        await Promise.all(cachePromises);
        console.log('✅ Cached MongoDB APPLICATION sessions to Redis');
      }
    }

    // Filter out temporary sessions that have no messages (don't show empty temp sessions)
    sessions = sessions.filter(session => !session.isTemporary || (session.messages && session.messages.length > 0));

    // Create fresh temporary session for this user (not saved anywhere)
    const tempSessionId = generateSessionId(userId);
    const tempSession = {
      _id: tempSessionId,
      userId,
      name: 'New Session',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      code: "",
      ui: {},
      isTemporary: true,
    };

    // Sort sessions by updatedAt (most recent first)
    sessions.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    // Prepend temporary session to sessions list
    res.json({ sessions: [tempSession, ...sessions] });

  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// POST new temporary session - only generate, do not persist yet
router.post('/sessions/new', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id?.toString();

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const sessionId = generateSessionId(userId);
    const now = new Date();

    const newSession = {
      _id: sessionId,
      userId,
      name: `Session ${now.toLocaleString()}`,
      createdAt: now,
      updatedAt: now,
      messages: [],
      code: "",
      ui: {},
      isTemporary: true,
    };

    // Return the new temp session (not persisted)
    console.log('🕓 New session generated but not saved yet:', sessionId);
    res.json({ session: newSession });

  } catch (error) {
    console.error('❌ Error generating new session:', error);
    res.status(500).json({ message: 'Error generating new session' });
  }
});

// GET single session by ID, try Redis first then MongoDB
router.get('/sessions/:sessionId', isAuthenticated, async (req, res) => {
  const userId = req.user._id?.toString() || req.user.id?.toString();
  const { sessionId } = req.params;

  try {
    const sessionKey = getSessionKey(userId, sessionId);
    
    // 1. Try Redis first
    let sessionData = await redisClient.get(sessionKey);
    if (sessionData) {
      console.log('✅ Loaded session from Redis');
      return res.json({ session: JSON.parse(sessionData) });
    }

    // 2. Else load from MongoDB
    const session = await SessionModel.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // 3. Cache in Redis for next time
    await redisClient.setex(
      sessionKey,
      86400,
      JSON.stringify(session)
    );

    console.log('✅ Loaded session from MongoDB (and cached to Redis)');
    res.json({ session });

  } catch (err) {
    console.error('❌ Error loading session:', err);
    res.status(500).json({ message: 'Error loading session' });
  }
});

// PUT update session - persist if it has messages
router.put('/sessions/:sessionId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id?.toString();
    const { sessionId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const sessionKey = getSessionKey(userId, sessionId);

    // Get existing session data
    let existingSession = await redisClient.get(sessionKey);
    if (existingSession) {
      existingSession = JSON.parse(existingSession);
    } else {
      existingSession = await SessionModel.findOne({ _id: sessionId, userId });
    }

    const messages = updateData.messages || existingSession?.messages || [];

    // If no messages, keep as temporary session
    if (!messages.length) {
      const tempSession = {
        ...(existingSession || {
          _id: sessionId,
          userId,
          createdAt: new Date(),
        }),
        ...updateData,
        updatedAt: new Date(),
        isTemporary: true,
      };

      // Store in Redis temporarily
      await redisClient.setex(sessionKey, 3600, JSON.stringify(tempSession)); // 1 hour for temp sessions

      console.log(`⚠️ Session ${sessionId} kept as temporary (no messages)`);
      return res.json({ session: tempSession });
    }

    // Merge old + new data
    const updatedSession = {
      ...(existingSession || {
        _id: sessionId,
        userId,
        createdAt: new Date(),
      }),
      ...updateData,
      updatedAt: new Date(),
      isTemporary: false, // now this session is persisted
    };

    // Save to Redis (24 hours for persistent sessions)
    await redisClient.setex(sessionKey, 86400, JSON.stringify(updatedSession));

    // Save to MongoDB (upsert)
    await SessionModel.findOneAndUpdate(
      { _id: sessionId, userId },
      updatedSession,
      { upsert: true, new: true }
    );

    console.log('✅ Session updated and persisted (MongoDB + Redis):', sessionId);
    res.json({ session: updatedSession });

  } catch (error) {
    console.error('❌ Error updating session:', error);
    res.status(500).json({ message: 'Error updating session' });
  }
});

// DELETE session from Redis + MongoDB
router.delete('/sessions/:sessionId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id?.toString();
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const sessionKey = getSessionKey(userId, sessionId);

    // Delete from Redis
    await redisClient.del(sessionKey);

    // Delete from MongoDB
    await SessionModel.findOneAndDelete({ _id: sessionId, userId });

    console.log('✅ Session deleted from both Redis and MongoDB:', sessionId);
    res.json({ message: 'Session deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting session:', error);
    res.status(500).json({ message: 'Error deleting session' });
  }
});

module.exports = router;