// ================================================
// ZEDLEARN ONLINE — DOWNLOADS
// A Mutale TV Product
// ================================================

document.addEventListener('DOMContentLoaded', async function() {

  const path = window.location.pathname;

  if (path.includes('past-papers')) { await loadPastPapers(); setupFilters(loadPastPapers); }
  if (path.includes('lesson-scripts')) { await loadLessonScripts(); setupFilters(loadLessonScripts); }
  if (path.includes('books')) { await loadBooks(); setupFilters(loadBooks); }
  if (path.includes('videos')) { await loadVideos(); setupFilters(loadVideos); }

});


// ===== HELPER =====
function getFilters() {
  return {
    grade: getVal('filter-grade'),
    subject: getVal('filter-subject'),
    syllabus: getVal('filter-syllabus'),
    year: getVal('filter-year'),
    search: getVal('filter-search'),
    type: getVal('filter-type')
  };
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : 'all';
}

function setupFilters(loaderFn) {
  ['filter-grade','filter-subject','filter-syllabus','filter-year','filter-type'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', async function() { await loaderFn(getFilters()); });
  });
  const searchEl = document.getElementById('filter-search');
  if (searchEl) searchEl.addEventListener('input', async function() { await loaderFn(getFilters()); });
}

function showEmpty(container, title, message) {
  container.innerHTML = '<div class="empty-state"><div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg></div><h3>' + title + '</h3><p>' + message + '</p></div>';
}

function showLoading(container) {
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading resources...</p></div>';
}


// ===== PAST PAPERS =====
async function loadPastPapers(filters) {
  filters = filters || {};
  const container = document.getElementById('papers-container');
  const countEl = document.getElementById('results-count');
  if (!container) return;

  showLoading(container);

  if (!window.ZedLearnDB) {
    showEmpty(container, 'Resources Coming Soon', 'Past papers will appear here once uploaded by the admin. Join our WhatsApp channel for updates.');
    return;
  }

  const papers = await window.ZedLearnDB.getPastPapers(filters);
  if (countEl) countEl.textContent = papers.length + ' result' + (papers.length !== 1 ? 's' : '') + ' found';

  if (papers.length === 0) {
    showEmpty(container, 'No Papers Found', 'Try different filters or check back soon for new uploads.');
    return;
  }

  container.innerHTML = '<div class="resources-grid">' + papers.map(function(p) {
    const title = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(p.title) : p.title;
    const url = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(p.file_url) : p.file_url;
    return '<div class="resource-card"><div class="resource-card-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="resource-card-info"><h3>' + title + '</h3><div class="resource-badges"><span class="badge">' + p.grade + '</span><span class="badge">' + p.subject + '</span><span class="badge">' + p.syllabus + '</span>' + (p.year ? '<span class="badge">' + p.year + '</span>' : '') + '</div></div><a href="' + url + '" class="download-btn" target="_blank" data-id="' + p.id + '" data-title="' + title + '">Download</a></div>';
  }).join('') + '</div>';

  container.querySelectorAll('.download-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (window.ZedLearnDB) window.ZedLearnDB.incrementDownload('past_papers', this.dataset.id);
      if (window.ZedLearnAnalytics) window.ZedLearnAnalytics.trackDownload('paper', this.dataset.title, '', '');
    });
  });
}


// ===== LESSON SCRIPTS =====
async function loadLessonScripts(filters) {
  filters = filters || {};
  const container = document.getElementById('scripts-container');
  if (!container) return;
  showLoading(container);

  if (!window.ZedLearnDB) {
    showEmpty(container, 'Resources Coming Soon', 'Lesson scripts will appear here once uploaded.');
    return;
  }

  const scripts = await window.ZedLearnDB.getLessonScripts(filters);

  if (scripts.length === 0) {
    showEmpty(container, 'No Scripts Found', 'Try different filters or check back soon.');
    return;
  }

  container.innerHTML = '<div class="resources-grid">' + scripts.map(function(s) {
    const title = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(s.title) : s.title;
    const url = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(s.file_url) : s.file_url;
    return '<div class="resource-card"><div class="resource-card-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><div class="resource-card-info"><h3>' + title + '</h3><div class="resource-badges"><span class="badge">' + s.subject + '</span><span class="badge">' + s.grade + '</span></div>' + (s.description ? '<p class="resource-desc">' + s.description + '</p>' : '') + '</div><a href="' + url + '" class="download-btn" target="_blank">Download</a></div>';
  }).join('') + '</div>';
}


// ===== BOOKS =====
async function loadBooks(filters) {
  filters = filters || {};
  const container = document.getElementById('books-container');
  if (!container) return;
  showLoading(container);

  if (!window.ZedLearnDB) {
    showEmpty(container, 'Resources Coming Soon', 'Books will appear here once uploaded.');
    return;
  }

  const books = await window.ZedLearnDB.getBooks(filters);

  if (books.length === 0) {
    showEmpty(container, 'No Books Found', 'Try different filters or check back soon.');
    return;
  }

  container.innerHTML = '<div class="books-grid">' + books.map(function(b) {
    const title = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(b.title) : b.title;
    const url = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(b.file_url) : b.file_url;
    const author = b.author ? window.ZedLearnSecurity.sanitizeInput(b.author) : 'Unknown Author';
    return '<div class="book-card"><div class="book-spine"></div><div class="book-info"><h3>' + title + '</h3><p class="book-author">' + author + '</p><span class="badge">' + b.book_type + '</span><a href="' + url + '" class="download-btn" target="_blank" style="margin-top:1rem; display:block;">Download</a></div></div>';
  }).join('') + '</div>';
}


// ===== VIDEOS =====
async function loadVideos(filters) {
  filters = filters || {};
  const container = document.getElementById('videos-container');
  if (!container) return;
  showLoading(container);

  if (!window.ZedLearnDB) {
    showEmpty(container, 'Resources Coming Soon', 'Videos will appear here once added.');
    return;
  }

  const videos = await window.ZedLearnDB.getVideos(filters);

  if (videos.length === 0) {
    showEmpty(container, 'No Videos Found', 'Subscribe to ZedLearn Academy on YouTube for updates.');
    return;
  }

  container.innerHTML = '<div class="videos-grid">' + videos.map(function(v) {
    const title = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(v.title) : v.title;
    const match = v.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = match ? match[1] : null;
    return '<div class="video-card"><div class="video-thumbnail">' + (videoId ? '<iframe src="https://www.youtube.com/embed/' + videoId + '" allowfullscreen loading="lazy" title="' + title + '"></iframe>' : '<div class="video-placeholder">Video unavailable</div>') + '</div><div class="video-info"><h3>' + title + '</h3><div class="resource-badges"><span class="badge">' + v.subject + '</span><span class="badge">' + v.grade + '</span></div></div></div>';
  }).join('') + '</div>';
}
