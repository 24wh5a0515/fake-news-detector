const News = require('../models/News');
const OpenAI = require('openai');

// Setup OpenRouter
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.GEMINI_API_KEY,
});

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

    // Check minimum length
    if (newsText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'News text must be at least 20 characters'
      });
    }

    // Check maximum length
    if (newsText.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'News text must be less than 2000 characters'
      });
    }

    // Prompt for AI
    const prompt = `
      You are a fake news detection expert.
      Analyze the following news text carefully.
      
      News Text: "${newsText}"
      
      Respond in this EXACT format and nothing else:
      RESULT: FAKE or REAL
      CONFIDENCE: a percentage like 90%
      REASON: explain in 2 to 3 lines why it is fake or real
    `;

    // Call OpenRouter API
    const completion = await client.chat.completions.create({
      model: 'poolside/laguna-xs.2:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = completion.choices[0].message.content;
    console.log('AI Raw Response:', responseText);

    // Extract RESULT
    const resultMatch = responseText.match(/RESULT:\s*(FAKE|REAL)/i);
    const extractedResult = resultMatch ? resultMatch[1].toUpperCase() : 'UNKNOWN';

    // Extract CONFIDENCE
    const confidenceMatch = responseText.match(/CONFIDENCE:\s*(\d+%)/i);
    const extractedConfidence = confidenceMatch ? confidenceMatch[1] : 'N/A';

    // Extract REASON
    const reasonMatch = responseText.match(/REASON:\s*([\s\S]+)/i);
    const extractedReason = reasonMatch ? reasonMatch[1].trim() : 'No reason provided';

    // Save to MongoDB
    const savedNews = await News.create({
      newsText: newsText,
      result: extractedResult,
      confidenceScore: extractedConfidence,
      reason: extractedReason
    });

    // Send response
    res.status(200).json({
      success: true,
      data: savedNews
    });

  } catch (error) {
    console.log('Error:', error.message);

    // Handle specific errors
    if (error.message.includes('429')) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.'
      });
    }

    if (error.message.includes('401')) {
      return res.status(401).json({
        success: false,
        message: 'API key error. Please check configuration.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get last 10 checked news from MongoDB
const getHistory = async (req, res) => {
  try {
    const history = await News.find()
      .sort({ checkedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete all history
const clearHistory = async (req, res) => {
  try {
    await News.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'History cleared successfully'
    });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const total = await News.countDocuments();
    const fakeCount = await News.countDocuments({ result: 'FAKE' });
    const realCount = await News.countDocuments({ result: 'REAL' });

    res.status(200).json({
      success: true,
      data: {
        total,
        fake: fakeCount,
        real: realCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { checkNews, getHistory, clearHistory, getStats };
