document.addEventListener('DOMContentLoaded', async function() {

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // HAMBURGER
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
      if (navbar && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
    });
  }

  // COOKIE POPUP
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookiePopup && cookieAccept) {
    if (!localStorage.getItem('zl_cookies_accepted')) {
      setTimeout(function() { cookiePopup.classList.add('show'); }, 2000);
    }
    cookieAccept.addEventListener('click', function() {
      localStorage.setItem('zl_cookies_accepted', 'true');
      cookiePopup.classList.remove('show');
      if (window.ZedLearnAnalytics) window.ZedLearnAnalytics.loadGA();
    });
  }

  // SCROLL TO TOP
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() { scrollTopBtn.classList.toggle('show', window.scrollY > 400); });
    scrollTopBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // NOTIFICATION BELL
  const bellBtn = document.getElementById('notification-bell');
  const bellDropdown = document.getElementById('notification-dropdown');
  const bellCount = document.getElementById('notification-count');
  if (bellBtn && bellDropdown && window.ZedLearnDB) {
    const notifications = await window.ZedLearnDB.getNotifications();
    const unread = notifications.filter(function(n) { return !n.is_read; });
    if (unread.length > 0 && bellCount) { bellCount.textContent = unread.length; bellCount.style.display = 'flex'; }
    const list = bellDropdown.querySelector('.notification-list');
    if (list) {
      list.innerHTML = notifications.length === 0
        ? '<div class="notification-empty">No new updates</div>'
        : notifications.map(function(n) {
            return '<div class="notification-item"><div class="notification-dot"></div><div class="notification-text">' + (window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(n.message) : n.message) + '</div></div>';
          }).join('');
    }
    bellBtn.addEventListener('click', function(e) { e.stopPropagation(); bellDropdown.classList.toggle('show'); });
    document.addEventListener('click', function() { bellDropdown.classList.remove('show'); });
  }

  // SOCIAL LINKS
  if (window.ZedLearnDB) {
    const links = await window.ZedLearnDB.getSocialLinks();
    const map = {
      'whatsapp-group-link': links.whatsapp_group,
      'whatsapp-channel-link': links.whatsapp_channel,
      'youtube-link': links.youtube,
      'telegram-link': links.telegram,
      'meet-link': links.meet,
      'footer-whatsapp': links.whatsapp_group,
      'footer-youtube': links.youtube,
      'footer-telegram': links.telegram,
      'comm-whatsapp-group': links.whatsapp_group,
      'comm-whatsapp-channel': links.whatsapp_channel,
      'comm-youtube': links.youtube,
      'comm-telegram': links.telegram,
      'comm-meet': links.meet,
      'hero-youtube-btn': links.youtube,
      'contact-whatsapp': links.whatsapp_group,
      'contact-youtube': links.youtube
    };
    Object.keys(map).forEach(function(id) {
      const el = document.getElementById(id);
      if (el && map[id] && map[id] !== '#') el.href = map[id];
    });
  }

});
