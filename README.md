# 🔍 AI Fake News Detector

An AI-powered web application that detects whether a news article is **Real or Fake** using OpenRouter AI.

## 🌟 Features
- ✅ Paste any news text — AI detects Real or Fake
- 🎤 Voice input — speak news instead of typing
- 📊 Confidence score percentage
- 🤖 AI generated reason for result
- 📋 History of last 10 checked news
- 📈 Live statistics — Total, Fake, Real counts
- 🗑️ Clear history from database
- 📱 Mobile responsive design
- 🔴 Red theme for Fake news
- 🟢 Green theme for Real news

## 🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- AI: OpenRouter API
- Voice: Web Speech API

## 📁 Project Structure
fake-news-detector/
├── controllers/
│   └── newsController.js
├── models/
│   └── News.js
├── public/
│   ├── index.html
│   ├── result.html
│   ├── 404.html
│   ├── app.js
│   ├── result.js
│   └── style.css
├── routes/
│   └── news.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js

## ⚙️ How to Run

1. Clone the repository
   git clone https://github.com/24wh5a0515/fake-news-detector.git
   cd fake-news-detector


2. Install dependencies
   npm install

3. Create .env file and add your keys
   MONGO_URI=mongodb://localhost:27017/fakenewsdb
   GEMINI_API_KEY=your_openrouter_api_key_here
   PORT=3000

4. Start MongoDB
   mongod

5. Start the server
   node server.js

6. Open browser → http://localhost:3000

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/news/check | Check if news is fake or real |
| GET | /api/news/history | Get last 10 checked news |
| DELETE | /api/news/history | Clear all history |
| GET | /api/news/stats | Get statistics |

## 📌 How It Works
User pastes or speaks news text
↓
Node.js backend receives text
↓
Sends to OpenRouter AI API
↓
AI analyzes and responds
↓
Result saved to MongoDB
↓
User sees FAKE or REAL with
confidence score and reason

## 👨‍💻 Developer
- Name: Saraswathi Dayyapu
- College: BVRIT Hyderabad College of Engineering For Women
- Academic Year: 2025-26