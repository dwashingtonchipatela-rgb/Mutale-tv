// ================================================
// ZEDLEARN ONLINE — MAIN JAVASCRIPT
// A Mutale TV Product
// ================================================

document.addEventListener('DOMContentLoaded', async function() {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }


  // ===== HAMBURGER MENU =====
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', !isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navbar && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ===== COOKIE POPUP =====
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookiePopup && cookieAccept) {
    if (!localStorage.getItem('zl_cookies_accepted')) {
      setTimeout(function() {
        cookiePopup.classList.add('show');
      }, 2000);
    }

    cookieAccept.addEventListener('click', function() {
      localStorage.setItem('zl_cookies_accepted', 'true');
      cookiePopup.classList.remove('show');
      if (window.ZedLearnAnalytics) window.ZedLearnAnalytics.loadGA();
    });
  }


  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ===== NOTIFICATION BELL =====
  const bellBtn = document.getElementById('notification-bell');
  const bellDropdown = document.getElementById('notification-dropdown');
  const bellCount = document.getElementById('notification-count');

  if (bellBtn && bellDropdown) {

    // Load notifications from Supabase
    if (window.ZedLearnDB) {
      const notifications = await window.ZedLearnDB.getNotifications();
      const unread = notifications.filter(n => !n.is_read);

      if (unread.length > 0) {
        bellCount.textContent = unread.length;
        bellCount.style.display = 'flex';
      }

      bellDropdown.querySelector('.notification-list').innerHTML =
        notifications.length === 0
          ? '<div class="notification-empty">No new updates</div>'
          : notifications.map(function(n) {
              return '<div class="notification-item">' +
                '<div class="notification-dot"></div>' +
                '<div class="notification-text">' + (window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(n.message) : n.message) + '</div>' +
                '</div>';
            }).join('');
    }

    bellBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      bellDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function() {
      bellDropdown.classList.remove('show');
    });
  }


  // ===== LOAD SOCIAL LINKS =====
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
      'banner-youtube-btn': links.youtube
    };
    Object.keys(map).forEach(function(id) {
      const el = document.getElementById(id);
      if (el && map[id] && map[id] !== '#') el.href = map[id];
    });
  }


  // ===== SEARCH =====
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim().length > 1) {
        if (window.ZedLearnAnalytics) window.ZedLearnAnalytics.trackSearch(this.value.trim());
        window.location.href = determineSearchPage() + '?search=' + encodeURIComponent(this.value.trim());
      }
    });
  }

  function determineSearchPage() {
    const path = window.location.pathname;
    if (path.includes('pages/')) return '../resources/past-papers.html';
    return 'pages/resources/past-papers.html';
  }

});
