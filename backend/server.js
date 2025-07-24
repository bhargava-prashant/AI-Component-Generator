require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis');
const cors = require('cors');
const passport = require('passport');
const redisClient = require('./redisClient');
const mongoose = require('./config/db');
const generateRoute = require('./routes/generate');
const geminiRoute = require('./routes/gemini');

require('./config/passport');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Session Configuration
const redisStore = RedisStore(session); // <-- Important Fix
app.use(session({
  store: new redisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: false, // true if using HTTPS
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 🔐 Protected Route Example
app.get('/api/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Protected content', user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// 🚪 Logout
app.get('/api/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
});


app.use('/api/generate', geminiRoute);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
