const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Local signup and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true // Enable session
  }),
  (req, res) => {
    // Session is automatically set by passport, no need to sign token manually
    res.redirect('/auth/success');
  }
);

// Auth success route (can return session info or redirect)
router.get('/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      message: 'Login successful',
      user: req.user
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: 'Logged out successfully' });
      });
    });
  });
  


module.exports = router;
