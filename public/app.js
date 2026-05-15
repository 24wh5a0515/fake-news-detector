// Speech Recognition Setup
let recognition = null;
let isListening = false;

// Setup microphone
function setupMicrophone() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    // When speech detected
    recognition.onresult = function(event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      document.getElementById('newsInput').value = transcript;
      document.getElementById('charCount').textContent = transcript.length;
    };

    // When speech ends
    recognition.onend = function() {
      isListening = false;
      updateMicButton(false);
    };

    // On error
    recognition.onerror = function(event) {
      isListening = false;
      updateMicButton(false);
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access in browser settings.');
      }
    };

  } else {
    // Browser does not support
    const micBtn = document.getElementById('micBtn');
    micBtn.style.display = 'none';
  }
}

// Toggle microphone on/off
function toggleMicrophone() {
  if (!recognition) {
    alert('Your browser does not support voice input. Please use Chrome or Edge.');
    return;
  }

  if (isListening) {
    // Stop listening
    recognition.stop();
    isListening = false;
    updateMicButton(false);
  } else {
    // Start listening
    recognition.start();
    isListening = true;
    updateMicButton(true);
  }
}

// Update mic button appearance
function updateMicButton(listening) {
  const micBtn = document.getElementById('micBtn');
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceDot = document.getElementById('voiceDot');
  const voiceStatusText = document.getElementById('voiceStatusText');

  if (listening) {
    micBtn.textContent = '⏹️ Stop';
    micBtn.classList.add('mic-active');
    voiceStatus.classList.add('listening');
    voiceDot.classList.add('active');
    voiceStatusText.textContent = '🎤 Listening... Speak now';
  } else {
    micBtn.textContent = '🎤 Speak';
    micBtn.classList.remove('mic-active');
    voiceStatus.classList.remove('listening');
    voiceDot.classList.remove('active');
    voiceStatusText.textContent = 'Click microphone to speak';
  }
}

// When page loads
window.onload = function() {
  setupMicrophone();
  loadHistory();
};

// Count characters as user types
document.getElementById('newsInput').addEventListener('input', function() {
  const count = this.value.length;
  document.getElementById('charCount').textContent = count;
});

// Main function — Check News
async function checkNews() {
  const newsText = document.getElementById('newsInput').value.trim();

  // Stop microphone if listening
  if (isListening) {
    recognition.stop();
    isListening = false;
    updateMicButton(false);
  }

  // Check if empty
  if (newsText === '') {
    alert('Please enter some news text first!');
    return;
  }

  // Check minimum length
  if (newsText.length < 20) {
    alert('Please enter at least 20 characters for better accuracy!');
    return;
  }

  hideResult();
  showLoading();
  disableButton();

  try {
    const response = await fetch('/api/news/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsText: newsText })
    });

    const data = await response.json();
    hideLoading();

    if (data.success) {
      showResult(data.data);
      loadHistory();
    } else {
      alert('Error: ' + data.message);
      enableButton();
    }

  } catch (error) {
    hideLoading();
    alert('Something went wrong. Please try again.');
    enableButton();
  }
}

// Show result → go to result page
function showResult(data) {
  localStorage.setItem('newsResult', JSON.stringify(data));
  window.location.href = '/result.html';
}

// Load history
async function loadHistory() {
  try {
    const response = await fetch('/api/news/history');
    const data = await response.json();
    const historyList = document.getElementById('historyList');

    if (data.success && data.data.length > 0) {
      historyList.innerHTML = '';
      data.data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        const badgeClass = item.result === 'FAKE' ? 'fake' : 'real';
        const badgeText = item.result === 'FAKE' ? '❌ FAKE' : '✅ REAL';
        const date = new Date(item.checkedAt);
        const formattedDate = date.toLocaleDateString()
          + ' ' + date.toLocaleTimeString();

        div.innerHTML = `
          <div class="history-top">
            <span class="history-badge ${badgeClass}">${badgeText}</span>
            <span class="history-date">${formattedDate}</span>
          </div>
          <p class="history-text">${item.newsText.substring(0, 100)}...</p>
          <p class="history-confidence">Confidence: ${item.confidenceScore}</p>
        `;
        historyList.appendChild(div);
      });
    } else {
      historyList.innerHTML = '<p class="no-history">No history yet</p>';
    }
  } catch (error) {
    console.log('History error:', error);
  }
}

// Clear history
function clearHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '<p class="no-history">No history yet</p>';
}

// Clear input
function clearInput() {
  document.getElementById('newsInput').value = '';
  document.getElementById('charCount').textContent = '0';
  if (isListening) {
    recognition.stop();
    isListening = false;
    updateMicButton(false);
  }
}

// Check Again
function checkAgain() {
  document.getElementById('newsInput').value = '';
  document.getElementById('charCount').textContent = '0';
  hideResult();
  enableButton();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper functions
function showLoading() {
  document.getElementById('loadingCard').style.display = 'block';
}
function hideLoading() {
  document.getElementById('loadingCard').style.display = 'none';
}
function hideResult() {
  document.getElementById('resultCard').style.display = 'none';
}
function disableButton() {
  const btn = document.getElementById('checkBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Analyzing...';
}
function enableButton() {
  const btn = document.getElementById('checkBtn');
  btn.disabled = false;
  btn.textContent = '🔍 Check News';
}