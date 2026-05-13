import './style.css'

let executors = [];
let currentFilters = {
  pricing: [],
  keysystem: [],
  platform: [],
  type: [],
  detection: [],
  status: []
};

let sortBy = 'name';
let searchQuery = '';

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Link skopiowany!');
  });
}

// Funkcja parsująca dane z pliku JSON na format aplikacji
async function loadData() {
  try {
    const response = await fetch('./Nowy Dokument tekstowy.json');
    const rawData = await response.json();
    
    executors = rawData.map(item => ({
      name: item.title || 'Unknown',
      version: item.version || 'N/A',
      pricing: item.free ? 'free' : 'paid',
      price: item.cost || (item.free ? 'Free' : 'Paid'),
      keysystem: item.keysystem ? 'keysystem' : 'keyless',
      platforms: [item.platform].filter(Boolean),
      detection: item.detected ? 'Detected' : (item.clientmods ? 'Bypass' : 'Undetected'),
      sUNC: item.suncPercentage || 0,
      UNC: item.uncPercentage || 0,
      decompiler: !!item.decompiler,
      multiInstance: !!item.multiInject,
      raknet: !!item.raknet,
      updated: !!item.updateStatus,
      link: item.websitelink || '#',
      type: item.extype && item.extype.includes('external') ? 'external' : 'internal'
    }));

    renderExecutors();
  } catch (error) {
    console.error('Błąd podczas ładowania danych:', error);
    showToast('Błąd ładowania pliku JSON!');
  }
}

function renderExecutors() {
  const container = document.getElementById('executors-container');
  const resultsCount = document.getElementById('results-count');
  if (!container) return;
  
  container.innerHTML = '';

  let filtered = executors.filter(ex => {
    if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (currentFilters.pricing.length > 0 && !currentFilters.pricing.includes(ex.pricing)) return false;
    if (currentFilters.keysystem.length > 0 && !currentFilters.keysystem.includes(ex.keysystem)) return false;
    if (currentFilters.platform.length > 0) {
      const hasPlatform = ex.platforms.some(p => currentFilters.platform.includes(p));
      if (!hasPlatform) return false;
    }
    if (currentFilters.type.length > 0 && !currentFilters.type.includes(ex.type)) return false;
    if (currentFilters.detection.length > 0 && !currentFilters.detection.includes(ex.detection)) return false;
    if (currentFilters.status.length > 0) {
      const statusValue = ex.updated ? 'updated' : 'outdated';
      if (!currentFilters.status.includes(statusValue)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'unc') return b.UNC - a.UNC;
    if (sortBy === 'sunc') return b.sUNC - a.sUNC;
    return 0;
  });

  resultsCount.textContent = `Znaleziono: ${filtered.length} ${filtered.length === 1 ? 'executora' : 'executorów'}`;

  filtered.forEach((ex, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.03}s`;
    
    const formatUNC = (val) => val === 0 ? 'N/A' : `${val}%`;

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <h2>${ex.name}</h2>
          <span class="version-tag">${ex.version}</span>
        </div>
        <div class="price-tag">${ex.price}</div>
      </div>

      <div class="status-badges">
        <span class="badge ${ex.updated ? 'updated' : 'outdated'}">${ex.updated ? 'Zaktualizowany' : 'Brak Aktualizacji'}</span>
        <span class="badge ${ex.detection.toLowerCase()}">${ex.detection}</span>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-row">
            <span class="stat-label">sUNC Support</span>
            <span class="stat-value">${formatUNC(ex.sUNC)}</span>
          </div>
          ${ex.sUNC > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: ${ex.sUNC}%; background: var(--accent-primary)"></div></div>` : ''}
        </div>
        <div class="stat-item">
          <div class="stat-row">
            <span class="stat-label">UNC Support</span>
            <span class="stat-value">${formatUNC(ex.UNC)}</span>
          </div>
          ${ex.UNC > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: ${ex.UNC}%; background: var(--accent-secondary)"></div></div>` : ''}
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-item"><span class="feature-icon ${ex.decompiler ? 'yes' : 'no'}">${ex.decompiler ? '✓' : '✗'}</span><span>Decompiler</span></div>
        <div class="feature-item"><span class="feature-icon ${ex.multiInstance ? 'yes' : 'no'}">${ex.multiInstance ? '✓' : '✗'}</span><span>Multi-Instance</span></div>
        <div class="feature-item"><span class="feature-icon ${ex.raknet ? 'yes' : 'no'}">${ex.raknet ? '✓' : '✗'}</span><span>Raknet</span></div>
        <div class="feature-item"><span class="feature-icon yes">✓</span><span>${ex.platforms.join(', ')}</span></div>
      </div>

      <div class="card-actions">
        <a href="${ex.link}" target="_blank" class="card-link">Odwiedź Stronę</a>
        <button class="copy-btn" title="Kopiuj link">📋</button>
      </div>
    `;

    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(ex.link);
    });

    container.appendChild(card);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">Nie znaleziono executorów spełniających wybrane kryteria.</div>`;
  }
}

// Global Event Listeners
document.querySelectorAll('.pill-btn, .platform-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filterGroup = btn.parentElement;
    const filterType = filterGroup.dataset.filter;
    const value = btn.dataset.value;

    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      currentFilters[filterType] = [];
    } else {
      filterGroup.querySelectorAll('.pill-btn, .platform-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilters[filterType] = [value];
    }
    renderExecutors();
  });
});

document.getElementById('sort-by').addEventListener('change', (e) => {
  sortBy = e.target.value;
  renderExecutors();
});

document.getElementById('executor-search').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderExecutors();
});

document.getElementById('clear-all').addEventListener('click', () => {
  currentFilters = { pricing: [], keysystem: [], platform: [], type: [], detection: [], status: [] };
  searchQuery = '';
  document.getElementById('executor-search').value = '';
  document.querySelectorAll('.pill-btn, .platform-btn').forEach(btn => btn.classList.remove('active'));
  renderExecutors();
});

// Start
loadData();
