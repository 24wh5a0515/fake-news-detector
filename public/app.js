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

    recognition.onresult = function(event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      document.getElementById('newsInput').value = transcript;
      document.getElementById('charCount').textContent = transcript.length;
    };

    recognition.onend = function() {
      isListening = false;
      updateMicButton(false);
    };

    recognition.onerror = function(event) {
      isListening = false;
      updateMicButton(false);
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access.');
      }
    };
  } else {
    const micBtn = document.getElementById('micBtn');
    if (micBtn) micBtn.style.display = 'none';
  }
}

// Toggle microphone
function toggleMicrophone() {
  if (!recognition) {
    alert('Voice input not supported. Please use Chrome or Edge.');
    return;
  }
  if (isListening) {
    recognition.stop();
    isListening = false;
    updateMicButton(false);
  } else {
    recognition.start();
    isListening = true;
    updateMicButton(true);
  }
}

// Update mic button
function updateMicButton(listening) {
  const micBtn = document.getElementById('micBtn');
  const voiceDot = document.getElementById('voiceDot');
  const voiceStatusText = document.getElementById('voiceStatusText');
  const voiceStatus = document.getElementById('voiceStatus');

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
  loadStats();
};

// Count characters
document.getElementById('newsInput').addEventListener('input', function() {
  const count = this.value.length;
  document.getElementById('charCount').textContent = count;
});

// Main function — Check News
async function checkNews() {
  const newsText = document.getElementById('newsInput').value.trim();

  if (isListening) {
    recognition.stop();
    isListening = false;
    updateMicButton(false);
  }

  if (newsText === '') {
    showAlert('Please enter some news text first!');
    return;
  }

  if (newsText.length < 20) {
    showAlert('Please enter at least 20 characters for better accuracy!');
    return;
  }

  if (newsText.length > 2000) {
    showAlert('News text is too long. Please keep it under 2000 characters.');
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
      loadStats();
    } else {
      showAlert('Error: ' + data.message);
      enableButton();
    }

  } catch (error) {
    hideLoading();
    showAlert('Connection error. Make sure server is running.');
    enableButton();
  }
}

// Show result
function showResult(data) {
  localStorage.setItem('newsResult', JSON.stringify(data));
  window.location.href = '/result.html';
}

// Load stats
async function loadStats() {
  try {
    const response = await fetch('/api/news/stats');
    const data = await response.json();

    if (data.success) {
      document.getElementById('totalChecked').textContent = data.data.total;
      document.getElementById('totalFake').textContent = data.data.fake;
      document.getElementById('totalReal').textContent = data.data.real;
    }
  } catch (error) {
    console.log('Stats error:', error);
  }
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

// Clear history from database
async function clearHistory() {
  if (!confirm('Are you sure you want to clear all history?')) return;

  try {
    const response = await fetch('/api/news/history', {
      method: 'DELETE'
    });
    const data = await response.json();

    if (data.success) {
      document.getElementById('historyList').innerHTML =
        '<p class="no-history">No history yet</p>';
      loadStats();
    }
  } catch (error) {
    console.log('Clear history error:', error);
  }
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

// Show custom alert
function showAlert(message) {
  alert(message);
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