require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const redisClient = require('./redisClient');
const generateRoute = require('./routes/generate');
const geminiRoute = require('./routes/gemini');
require('./config/db');
require('./config/passport');

const app = express();

// Trust proxy (essential for Render)
app.set('trust proxy', 1);

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', // Local development
      'https://ai-component-generator-frontend-oor6.onrender.com' // Your frontend URL
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origin not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is crucial for cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Using the correct method for connect-redis@6.1.3
const RedisStore = require('connect-redis')(session);
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

console.log('✅ Using connect-redis v6.1.3 (CommonJS)');

// Session configuration for production
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'your-very-secure-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom session name
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in production
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
  }
}));

// Debug middleware to log requests and sessions
app.use((req, res, next) => {
  console.log('=== REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Cookies:', req.headers.cookie);
  console.log('🧠 Session ID:', req.sessionID);
  console.log('🧠 Session Data:', req.session);
  console.log('🧠 User:', req.user);
  console.log('==================');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
app.use('/api/generate', geminiRoute);

// Protected route example
app.get('/api/protected', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ message: 'Protected content', user: req.user });
  }
  res.status(401).json({ message: 'Unauthorized' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
