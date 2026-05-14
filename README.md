# 🔍 AI Fake News Detector

A web application that detects whether a news article is **Real or Fake** 
using OpenRouter AI.

## 🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- AI: OpenRouter API (nvidia/nemotron-super-49b model)

## ⚙️ How to Run

1. Clone the repository
   git clone https://github.com/24wh5a0515/fake-news-detector.git

2. Install dependencies
   npm install

3. Create .env file and add your keys
   MONGO_URI=mongodb://localhost:27017/fakenewsdb
   GEMINI_API_KEY=your_openrouter_api_key_here
   PORT=3000

4. Start the server
   node server.js

5. Open browser → http://localhost:3000

## 📌 Features
- Paste any news text
- AI detects Real or Fake
- Shows confidence score percentage
- Shows AI generated reason
- Stores history in MongoDB
- Last 5 checked news shown on homepage

## 👨‍💻 Developer
- Saraswathi Dayyapu 
- BVRIT Hyderabad College of Engineering For Women
- 2025-26