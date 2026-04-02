// ============================================
// ONLY CHANGE THIS — YOUR GOOGLE ANALYTICS ID
// Get from analytics.google.com (optional)
// Leave as is if not set up yet
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

if (localStorage.getItem('zl_cookies_accepted')) loadGA();

function trackEvent(name, params) { if (!window.gtag) return; window.gtag('event', name, params || {}); }
function trackDownload(type, title) { trackEvent('file_download', { resource_type: type, resource_title: title }); }
function trackSearch(query) { if (query && query.length > 1) trackEvent('search', { search_term: query.substring(0, 100) }); }

window.ZedLearnAnalytics = { loadGA, trackEvent, trackDownload, trackSearch };
