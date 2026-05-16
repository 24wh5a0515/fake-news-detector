const express = require('express');
const router = express.Router();
const {
  checkNews,
  getHistory,
  clearHistory,
  getStats
} = require('../controllers/newsController');

// POST → /api/news/check → Check if news is real or fake
router.post('/check', checkNews);

// GET → /api/news/history → Get last 10 checked news
router.get('/history', getHistory);

// DELETE → /api/news/history → Clear all history
router.delete('/history', clearHistory);

// GET → /api/news/stats → Get statistics
router.get('/stats', getStats);

module.exports = router;