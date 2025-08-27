const Vote = require('../models/Vote');
const User = require('../models/User');

// POST /api/votes
exports.submitVote = async (req, res) => {
  const { pollTitle, optionIndex } = req.body;
  const { id: userId } = req.user;

  try {
    // Get user to verify and get campusId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already voted on this poll
    const existingVote = await Vote.findOne({ pollTitle, userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this poll.' });
    }

    // Create new vote
    const vote = new Vote({
      pollTitle,
      optionIndex,
      userId,
      campusId: user.campusId,
    });

    await vote.save();

    res.json({ message: 'Vote submitted successfully!' });
  } catch (err) {
    console.error('Vote submission error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate vote detected' });
    }
    res.status(500).json({ message: 'Failed to submit vote. Please try again.' });
  }
};

// GET /api/votes/history
exports.getVoteHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.user.id })
      .sort({ votedAt: -1 })
      .populate('userId', 'name email');

    res.json(votes);
  } catch (err) {
    console.error('Vote history fetch error:', err);
    res.status(500).json({ message: 'Failed to load vote history' });
  }
};
