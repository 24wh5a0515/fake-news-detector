// When page loads
window.onload = function() {
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

  // Check if input is empty
  if (newsText === '') {
    alert('Please enter some news text first!');
    return;
  }

  // Check minimum length
  if (newsText.length < 20) {
    alert('Please enter at least 20 characters for better accuracy!');
    return;
  }

  // Hide result — show loading
  hideResult();
  showLoading();
  disableButton();

  try {
    // Call backend API
    const response = await fetch('/api/news/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newsText: newsText })
    });

    const data = await response.json();

    // Hide loading
    hideLoading();

    if (data.success) {
      // Show result
      showResult(data.data);
      // Refresh history
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

// Show result — Save to localStorage and go to result page
function showResult(data) {
  // Save result to localStorage
  localStorage.setItem('newsResult', JSON.stringify(data));

  // Go to result page
  window.location.href = '/result.html';
}

// Load history from MongoDB
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

        // Format date
        const date = new Date(item.checkedAt);
        const formattedDate = date.toLocaleDateString()
          + ' ' + date.toLocaleTimeString();

        div.innerHTML = `
          <div class="history-header">
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
    console.log('History load error:', error);
  }
}

// Check Again button
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