'use strict';

// Reproduction of the six inputs and point values currently displayed on Appcardio.
// This reproduces that page's displayed logic; it is not a claim that the logic
// matches the original validated PARIS model. No patient data is persisted.
const SCORE_ITEMS = [
  { id: 'diabetes', label: 'Diabetes Mellitus', points: { '0': 0, '1': 1 } },
  { id: 'smoking', label: 'Current Smoking', points: { '0': 0, '1': 1 } },
  { id: 'acs', label: 'Acute Coronary Syndrome (ACS) as indication for PCI', points: { '0': 0, '1': 1 } },
  { id: 'priorPci', label: 'Prior PCI', points: { '0': 0, '1': 1 } },
  { id: 'smallStent', label: 'Stent Diameter < 3 mm', points: { '0': 0, '1': 1 } },
  { id: 'multivessel', label: 'Multivessel PCI', points: { '0': 0, '2': 2 } }
];

const form = document.getElementById('scoreForm');
const result = document.getElementById('result');
const status = document.getElementById('connectionStatus');

if (!form || !result || !status) {
  throw new Error('Calculator page is missing a required element.');
}

function updateConnectionStatus() {
  const offline = !navigator.onLine;
  status.classList.toggle('offline', offline);
  status.classList.toggle('online', !offline);
  status.innerHTML = offline
    ? '<span class="status-dot"></span> Offline mode'
    : '<span class="status-dot"></span> Online · Offline-ready';
}
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Validate explicitly so the calculate action behaves consistently in browsers.
  for (const item of SCORE_ITEMS) {
    const field = document.getElementById(item.id);
    if (!field || field.value === '') {
      if (field) {
        field.setCustomValidity('Please select an option.');
        field.reportValidity();
        field.addEventListener('change', () => field.setCustomValidity(''), { once: true });
        field.focus();
      }
      return;
    }
  }
  let total = 0;
  const rows = [];
  for (const item of SCORE_ITEMS) {
    const value = document.getElementById(item.id).value;
    if (!Object.prototype.hasOwnProperty.call(item.points, value)) {
      document.getElementById(item.id).focus();
      return;
    }
    const points = item.points[value];
    total += points;
    rows.push({ label: item.label, points });
  }

  // Match the risk-band wording displayed on the Appcardio page. That page
  // does not define what to display for a score of exactly 5, so do not infer it.
  let category, description, categoryClass;
  if (total <= 2) {
    category = 'Low Risk';
    description = 'Appcardio page classification: 0–2 points.';
    categoryClass = 'risk-low';
  } else if (total <= 4) {
    category = 'Intermediate Risk';
    description = 'Appcardio page classification: 3–4 points.';
    categoryClass = 'risk-intermediate';
  } else if (total > 5) {
    category = 'High Risk';
    description = 'Appcardio page classification: greater than 5 points.';
    categoryClass = 'risk-high';
  } else {
    category = 'Category not specified';
    description = 'The referenced Appcardio page does not specify a risk category for exactly 5 points. Do not infer a category.';
    categoryClass = 'risk-intermediate';
  }

  document.getElementById('scoreValue').textContent = String(total);
  document.getElementById('riskBadge').textContent = category;
  document.getElementById('riskBadge').className = `risk-badge ${categoryClass}`;
  document.getElementById('riskDescription').textContent = description;
  document.getElementById('scoreFill').style.width = `${(total / 7) * 100}%`;
  const breakdown = document.getElementById('breakdown');
  breakdown.replaceChildren();
  for (const row of rows) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    const points = document.createElement('span');
    label.textContent = row.label;
    points.className = 'points';
    points.textContent = `+${row.points}`;
    li.append(label, points);
    breakdown.append(li);
  }
  result.hidden = false;
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

form.addEventListener('reset', () => {
  result.hidden = true;
  document.getElementById('scoreValue').textContent = '—';
  document.getElementById('scoreFill').style.width = '0';
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.warn('Offline caching could not be enabled in this browser:', error);
    });
  });
}
