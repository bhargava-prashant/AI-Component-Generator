const User = require('../models/userModel');
const redisClient = require('../redisClient');
const { v4: uuidv4 } = require('uuid');


exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    req.login(user, async (err) => {
      if (err) {
        console.error('❌ Session login error:', err);
        return res.status(500).json({ message: 'Session error' });
      }

      console.log('✅ User session created after signup');
      return res.status(201).json({ 
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }, 
        message: 'Signed up successfully'
      });
    });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      console.log('⚠️ Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.login(user, async (err) => {
      if (err) {
        console.error('❌ Session login error:', err);
        return res.status(500).json({ message: 'Session error' });
      }

      console.log('✅ User session created after login');
      return res.json({ 
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          lastActiveAt: user.lastActiveAt
        }, 
        message: 'Logged in successfully'
      });
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  const userId = req.user?._id?.toString() || req.user?.id?.toString();
  
  // Clean up user's Redis sessions
  if (userId) {
    try {
      const keys = await redisClient.keys(`app_sess_user_${userId}_*`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        console.log(`✅ Cleaned up ${keys.length} Redis sessions for user ${userId}`);
      }
    } catch (redisError) {
      console.error('❌ Error cleaning up Redis sessions:', redisError);
    }
  }

  req.logout((err) => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ message: 'Logout error' });
    }
    
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('❌ Session destroy error:', destroyErr);
      }
      
      res.clearCookie('connect.sid');
      console.log('✅ User logged out and session destroyed');
      res.json({ message: 'Logged out successfully' });
    });
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error('❌ Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};
