const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, default: () => Date.now() + 3600000 },
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
