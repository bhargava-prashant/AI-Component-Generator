
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  messages: { type: Array, default: [] },
  code: { type: String, default: "" },
  ui: { type: Object, default: {} },
  isTemporary: { type: Boolean, default: false }
}, {
  timestamps: false // We're handling timestamps manually
});

// Index for faster queries
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
