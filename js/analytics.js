// ================================================
// ZEDLEARN ONLINE — ANALYTICS
// A Mutale TV Product
// ================================================
// Google Analytics tracks visitors automatically.
// You only need to replace the Measurement ID below
// after creating a Google Analytics account.
// Go to analytics.google.com to get your ID.
// It looks like G-XXXXXXXXXX
// ================================================


// ============================================
// ONLY CHANGE THIS — YOUR GOOGLE ANALYTICS ID
// Get this from analytics.google.com
// Leave as is if you have not set it up yet
// ============================================
const GA_ID = 'G-XXXXXXXXXX';
// ============================================


function loadGA() {
  if (window._gaLoaded) return;
  window._gaLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Only load after cookie consent
if (localStorage.getItem('zl_cookies_accepted')) loadGA();

function trackEvent(name, params) {
  if (!window.gtag) return;
  window.gtag('event', name, params || {});
}

function trackDownload(type, title, subject, grade) {
  trackEvent('file_download', { resource_type: type, resource_title: title, subject: subject, grade: grade });
}

function trackSearch(query) {
  if (query && query.length > 1) trackEvent('search', { search_term: query.substring(0, 100) });
}

function trackSocial(platform) {
  trackEvent('social_click', { platform: platform });
}

window.ZedLearnAnalytics = { loadGA, trackEvent, trackDownload, trackSearch, trackSocial };
