const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Session error' });
      const token = createToken(user);
      return res.status(201).json({ user, token });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Session error' });
      const token = createToken(user);
      return res.json({ user, token });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
