const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const voteController = require('../controllers/voteController');

// Submit a vote (requires login)
router.post('/', auth, voteController.submitVote);

// Get user's vote history
router.get('/history', auth, voteController.getVoteHistory);

module.exports = router;
