const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../utils/mailer');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, campusId } = req.body;

  try {
    if (!email.endsWith('@cambrian.edu')) {
      return res.status(400).json({ message: 'Only Cambrian College emails allowed' });
    }

    const existing = await User.findOne({ $or: [{ email }, { campusId }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or Campus ID already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, campusId });

    await user.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await ResetToken.create({ userId: user._id, token });

    await sendPasswordResetEmail(email, token);
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resetDoc = await ResetToken.findOne({ token, userId: decoded.id });

    if (!resetDoc || resetDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    await ResetToken.deleteOne({ token });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Invalid token' });
  }
};
