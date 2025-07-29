// // require('dotenv').config();
// // const express = require('express');
// // const session = require('express-session');
// // const RedisStore = require('connect-redis').default;
// // const cors = require('cors');
// // const passport = require('passport');
// // const redisClient = require('./redisClient');
// // const mongoose = require('mongoose');
// // const generateRoute = require('./routes/generate');
// // const geminiRoute = require('./routes/gemini');

// // require('./config/db');
// // require('./config/passport');

// // const app = express();

// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// // }));

// // app.use(express.json());

// // // ✅ FIXED: Properly initialize RedisStore with client
// // app.use(session({
// //   store: new RedisStore({ client: redisClient }), // Fixed: Pass redisClient properly
// //   secret: process.env.SESSION_SECRET || 'keyboard cat',
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
// //     httpOnly: true,
// //     secure: false, // Set to true in production with HTTPS
// //   }
// // }));

// // // Session debugging middleware
// // app.use((req, res, next) => {
// //   console.log('🧠 Session ID:', req.sessionID);
// //   console.log('🧠 Session Data:', req.session);
// //   next();
// // });

// // app.use(passport.initialize());
// // app.use(passport.session());

// // // Routes
// // app.use('/api/auth', require('./routes/authRoutes'));
// // app.use('/api/generate', geminiRoute);
// // app.use('/api/session', require('./routes/sessionRoutes'));

// // // Protected route example
// // app.get('/api/protected', (req, res) => {
// //   if (req.isAuthenticated()) {
// //     return res.json({ message: 'Protected content', user: req.user });
// //   }
// //   res.status(401).json({ message: 'Unauthorized' });
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// // ========== server.js (Final Working Version) ==========
// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');
// const passport = require('passport');
// const redisClient = require('./redisClient');
// const generateRoute = require('./routes/generate');
// const geminiRoute = require('./routes/gemini');
// require('./config/db');
// require('./config/passport');

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// app.use(express.json());

// // ✅ FIXED: Using the correct method for connect-redis@6.1.3
// const RedisStore = require('connect-redis')(session);
// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: 'sess:',
// });

// console.log('✅ Using connect-redis v6.1.3 (CommonJS)');

// app.use(session({
//   store: redisStore,
//   secret: process.env.SESSION_SECRET || 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
//     httpOnly: true,
//     secure: false, // Set to true in production with HTTPS
//   }
// }));

// // Session debugging middleware
// app.use((req, res, next) => {
//   console.log('🧠 Session ID:', req.sessionID);
//   console.log('🧠 Session Data:', req.session);
//   next();
// });

// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/session', require('./routes/sessionRoutes'));


// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/generate', geminiRoute);
// app.use('/api/session', require('./routes/sessionRoutes'));


// // Protected route example
// app.get('/api/protected', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.json({ message: 'Protected content', user: req.user });
//   }
//   res.status(401).json({ message: 'Unauthorized' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

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

app.use(cors({
  origin: 'https://ai-component-generator-frontend-oor6.onrender.com',
  credentials: true,
}));

app.use(express.json());

// ✅ FIXED: Using the correct method for connect-redis@6.1.3
const RedisStore = require('connect-redis')(session);
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

console.log('✅ Using connect-redis v6.1.3 (CommonJS)');

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true,       // ✅ Secure true for production (Render uses HTTPS)
    sameSite: 'none', // ✅ Allow cross-origin cookies
  }
}));

// Session debugging middleware
app.use((req, res, next) => {
  console.log('🧠 Session ID:', req.sessionID);
  console.log('🧠 Session Data:', req.session);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
