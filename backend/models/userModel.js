
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  lastActiveAt: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePwd) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePwd, this.password);
};

// Update last active timestamp
userSchema.methods.updateLastActive = function() {
  this.lastActiveAt = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
