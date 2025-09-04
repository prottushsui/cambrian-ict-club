const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Member' },
  role: { type: String, enum: ['Member', 'Committee', 'Admin'], default: 'Member' },
  campusId: { type: String, unique: true },
  lastLogin: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
