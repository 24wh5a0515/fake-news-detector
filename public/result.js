// Load result when page opens
window.onload = function() {
  loadResult();
};

function loadResult() {
  // Get result data from localStorage
  const resultData = localStorage.getItem('newsResult');

  // If no data → go back to home
  if (!resultData) {
    window.location.href = '/';
    return;
  }

  // Parse the data
  const data = JSON.parse(resultData);

  // Set big result badge
  const bigBadge = document.getElementById('bigResultBadge');

  if (data.result === 'FAKE') {
    bigBadge.innerHTML = `
      <div class="fake-result">
        <div class="result-icon">❌</div>
        <div class="result-text">FAKE NEWS</div>
        <div class="result-sub">This news appears to be false</div>
      </div>
    `;
    bigBadge.className = 'big-result-badge fake-bg';
    document.body.classList.add('fake-theme');

  } else if (data.result === 'REAL') {
    bigBadge.innerHTML = `
      <div class="real-result">
        <div class="result-icon">✅</div>
        <div class="result-text">REAL NEWS</div>
        <div class="result-sub">This news appears to be genuine</div>
      </div>
    `;
    bigBadge.className = 'big-result-badge real-bg';
    document.body.classList.add('real-theme');

  } else {
    bigBadge.innerHTML = `
      <div class="uncertain-result">
        <div class="result-icon">⚠️</div>
        <div class="result-text">UNCERTAIN</div>
        <div class="result-sub">Could not determine clearly</div>
      </div>
    `;
    bigBadge.className = 'big-result-badge uncertain-bg';
  }

  // Set confidence score
  document.getElementById('resultConfidence').textContent = data.confidenceScore;

  // Set news text
  document.getElementById('resultNewsText').textContent = data.newsText;

  // Set reason
  document.getElementById('resultReason').textContent = data.reason;

  // Set date
  const date = new Date(data.checkedAt);
  document.getElementById('resultDate').textContent =
    date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
}

// Go back to home
function goBack() {
  window.location.href = '/';
}