// Activity log array
const activityLog = [];

// Thresholds for suspicious activity
const thresholds = {
  maxClicksPerMinute: 50, // Example: 50 clicks / min
  maxKeysPerMinute: 100   // Example: 100 keys / min
};

// Track recent clicks and keys for thresholds
let clickCount = 0;
let keyCount = 0;
const samplePeriod = 60 * 1000; // 1 minute in ms
let lastSampleTime = Date.now();

// Helper to format current timestamp
function formatTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').slice(0, -1);
}

// Add entry to log and DOM
function logActivity(type, details, phase = 'bubble') {
  const entry = {
    timestamp: formatTimestamp(),
    type,
    details,
    phase
  };

  activityLog.push(entry);
  updateLogDOM(entry);
  checkThresholdsAndWarn();
}

// Update the DOM log container with a single entry
function updateLogDOM(entry) {
  const logContainer = document.getElementById('logContainer');
  const div = document.createElement('div');
  div.className = `log-item ${entry.type} ${entry.phase}`;
  div.textContent = `[${entry.timestamp}] ${entry.type.toUpperCase()} - ${entry.details} (${entry.phase})`;
  logContainer.appendChild(div);
  logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll
}

// Check thresholds and show warning if exceeded
function checkThresholdsAndWarn() {
  const now = Date.now();
  const elapsed = now - lastSampleTime;

  if (elapsed > samplePeriod) {
    // Reset counters every period
    clickCount = 0;
    keyCount = 0;
    lastSampleTime = now;
  }

  const warningArea = document.getElementById('warningArea');
  warningArea.innerHTML = ''; // Clear previous warnings

  if (clickCount > thresholds.maxClicksPerMinute) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning';
    warningDiv.textContent = `⚠️ Suspicious activity: High click rate (${clickCount} clicks/min).`;
    warningArea.appendChild(warningDiv);
  }

  if (keyCount > thresholds.maxKeysPerMinute) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning';
    warningDiv.textContent = `⚠️ Suspicious activity: High keypress rate (${keyCount} keys/min).`;
    warningArea.appendChild(warningDiv);
  }
}

// ===== Event Listeners (using event bubbling/capturing) =====

// 1. Clicks: Capture phase and bubble phase
document.addEventListener('click', function(e) {
  clickCount++;
  logActivity('click', `Target: ${e.target.tagName || e.target.nodeName}`, 'capture');
}, true); // useCapture=true → capture phase

document.addEventListener('click', function(e) {
  logActivity('click', `Target: ${e.target.tagName || e.target.nodeName}`, 'bubble');
}, false); // useCapture=false → bubble phase

// 2. Key events: Capture and bubble (on document.body / document)
document.addEventListener('keydown', function(e) {
  keyCount++;
  const keyDetails = `Key: ${e.key}, Code: ${e.code}, Target: ${e.target.tagName || e.target.nodeName}`;
  logActivity('key', keyDetails, 'capture');
}, true);

document.addEventListener('keydown', function(e) {
  const keyDetails = `Key: ${e.key}, Code: ${e.code}, Target: ${e.target.tagName || e.target.nodeName}`;
  logActivity('key', keyDetails, 'bubble');
}, false);

// 3. Focus events: Capture and bubble
document.addEventListener('focus', function(e) {
  logActivity('focus', `Focused: ${e.target.tagName || e.target.nodeName}`, 'capture');
}, true);

document.addEventListener('focus', function(e) {
  logActivity('focus', `Focused: ${e.target.tagName || e.target.nodeName}`, 'bubble');
}, false);

// 4. Blur events (for completeness)
document.addEventListener('blur', function(e) {
  logActivity('blur', `Blurred: ${e.target.tagName || e.target.nodeName}`, 'bubble');
}, false);

// ===== Button Controls =====

// Reset button
document.getElementById('resetBtn').addEventListener('click', function() {
  activityLog.length = 0; // Clear array
  document.getElementById('logContainer').innerHTML = '';
  document.getElementById('warningArea').innerHTML = '';
  clickCount = 0;
  keyCount = 0;
  lastSampleTime = Date.now();
  logActivity('system', 'Activity log reset by user', 'bubble');
});

// Export as formatted text
document.getElementById('exportBtn').addEventListener('click', function() {
  if (activityLog.length === 0) {
    alert('Log is empty. Perform some actions first.');
    return;
  }

  const exportText = activityLog
    .map(entry => `[${entry.timestamp}] ${entry.type.toUpperCase()} (${entry.phase}) - ${entry.details}`)
    .join('\n');

  // Create a Blob and trigger download
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user_activity_log_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
