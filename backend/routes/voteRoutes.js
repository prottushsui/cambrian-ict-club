const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const voteController = require('../controllers/voteController');

router.post('/', auth, voteController.submitVote);

module.exports = router;
