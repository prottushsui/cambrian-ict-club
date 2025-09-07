const Vote = require('../models/Vote');
const User = require('../models/User');
const { exec } = require('child_process');
const path = require('path');

// POST /api/votes
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

    // ✅ Send voting confirmation email via Python
    const userData = JSON.stringify({
      name: user.name,
      email: user.email,
      campusId: user.campusId
    }).replace(/"/g, '\\"');

    const options = ['Alex Johnson', 'Maria Garcia', 'Sam Wilson']; // Update based on poll
    const selectedOption = options[optionIndex] || `Option ${optionIndex}`;

    const scriptPath = path.join(__dirname, '../email_notifications.py');
    const cmd = `python3 ${scriptPath} --action vote --poll "${pollTitle}" --option "${selectedOption}" --data "${userData}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Email error:', error);
        return;
      }
      console.log('Voting confirmation email sent:', stdout);
    });

    res.json({ message: 'Vote submitted successfully! Confirmation email sent.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate vote detected' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to submit vote' });
  }
};
