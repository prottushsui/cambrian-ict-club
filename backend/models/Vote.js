const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollTitle: { type: String, required: true },
  optionIndex: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campusId: { type: String, required: true },
  votedAt: { type: Date, default: Date.now },
});

voteSchema.index({ pollTitle: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
