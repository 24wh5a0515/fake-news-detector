const News = require('../models/News');

// Check news - Main function
const checkNews = async (req, res) => {
  try {
    const { newsText } = req.body;

    // Check if user sent text
    if (!newsText || newsText.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide news text'
      });
    }

    // Temporary test response (Gemini API will replace this on Day 4)
    const testResult = {
      newsText: newsText,
      result: 'FAKE',
      confidenceScore: '90%',
      reason: 'This is a test response. Gemini AI will be connected on Day 4.'
    };

    // Save to MongoDB
    const savedNews = await News.create(testResult);

    // Send response back
    res.status(200).json({
      success: true,
      data: savedNews
    });

  } catch (error) {
    console.log('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get last 5 checked news from MongoDB
const getHistory = async (req, res) => {
  try {
    const history = await News.find()
      .sort({ checkedAt: -1 })  // Latest first
      .limit(5);                 // Only last 5

    res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    console.log('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { checkNews, getHistory };