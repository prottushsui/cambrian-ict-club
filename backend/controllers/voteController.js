const Vote = require('../models/Vote');
const User = require('../models/User');

exports.submitVote = async (req, res) => {
  const { pollTitle, optionIndex } = req.body;
  const { id: userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingVote = await Vote.findOne({ pollTitle, userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this poll.' });
    }

    const vote = new Vote({
      pollTitle,
      optionIndex,
      userId,
      campusId: user.campusId,
    });

    await vote.save();
    res.json({ message: 'Vote submitted successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate vote detected' });
    }
    res.status(500).json({ message: 'Failed to submit vote' });
  }
};
