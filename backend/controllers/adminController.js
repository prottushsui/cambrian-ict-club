const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    res.json({ users, events: 5, votes: 3 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
