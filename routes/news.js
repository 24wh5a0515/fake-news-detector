const express = require('express');
const router = express.Router();
const { checkNews, getHistory } = require('../controllers/newsController');

// POST → /api/news/check  → Check if news is real or fake
router.post('/check', checkNews);

// GET  → /api/news/history → Get last 5 checked news
router.get('/history', getHistory);

module.exports = router;