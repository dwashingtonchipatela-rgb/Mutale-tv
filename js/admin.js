// ================================================
// ZEDLEARN ONLINE — ADMIN JAVASCRIPT
// A Mutale TV Product
// ================================================

document.addEventListener('DOMContentLoaded', async function() {

  // ===== PROTECT ADMIN PAGES =====
  // Every admin page checks if user is logged in
  // If not logged in they are sent to login page
  const isLoginPage = window.location.pathname.includes('login.html');

  if (!isLoginPage && window.ZedLearnDB) {
    const loggedIn = await window.ZedLearnDB.checkAdminSession();
    if (!loggedIn) {
      window.location.href = 'login.html';
      return;
    }
  }


  // ===== MOBILE SIDEBAR =====
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }


  // ===== AUTO LOGOUT AFTER 2 HOURS =====
  let inactivityTimer;
  function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async function() {
      if (window.ZedLearnDB) await window.ZedLearnDB.adminLogout();
      alert('You have been logged out due to inactivity.');
      window.location.href = 'login.html';
    }, 2 * 60 * 60 * 1000);
  }
  ['click','keypress','scroll','mousemove'].forEach(e => document.addEventListener(e, resetTimer));
  resetTimer();


  // ===== LOGOUT BUTTONS =====
  document.querySelectorAll('.logout-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      if (window.ZedLearnDB) await window.ZedLearnDB.adminLogout();
      window.location.href = 'login.html';
    });
  });


  // ===== UPLOAD TABS =====
  const uploadTabs = document.querySelectorAll('.upload-tab');
  const uploadPanels = document.querySelectorAll('.upload-panel');

  uploadTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      uploadTabs.forEach(t => t.classList.remove('active'));
      uploadPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const panel = document.getElementById('panel-' + this.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });


  // ===== DRAG AND DROP UPLOAD ZONES =====
  document.querySelectorAll('.upload-zone').forEach(function(zone) {
    zone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drag-over'); });
    zone.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      const input = this.querySelector('input[type="file"]');
      if (input && e.dataTransfer.files.length > 0) {
        Object.defineProperty(input, 'files', { value: e.dataTransfer.files });
        input.dispatchEvent(new Event('change'));
      }
    });
  });


  // ===== FILE INPUT DISPLAY =====
  document.querySelectorAll('input[type="file"]').forEach(function(input) {
    input.addEventListener('change', function() {
      const display = document.getElementById(this.id + '-name');
      if (display && this.files.length > 0) {
        display.textContent = this.files[0].name;
      }
    });
  });


  // ===== YOUTUBE PREVIEW =====
  const videoUrlInput = document.getElementById('video-url');
  const videoPreview = document.getElementById('video-preview');

  if (videoUrlInput && videoPreview) {
    videoUrlInput.addEventListener('input', function() {
      const url = this.value.trim();
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (match) {
        videoPreview.innerHTML = '<iframe src="https://www.youtube.com/embed/' + match[1] + '" style="width:100%;height:200px;border:none;border-radius:8px;" allowfullscreen></iframe>';
      } else {
        videoPreview.innerHTML = '<p style="color:var(--admin-text-muted); text-align:center; padding:2rem;">Paste a YouTube URL above to see preview</p>';
      }
    });
  }


  // ===== UPLOAD PAPER =====
  const uploadPaperBtn = document.getElementById('upload-paper-btn');
  if (uploadPaperBtn && window.ZedLearnDB) {
    uploadPaperBtn.addEventListener('click', async function() {
      const title = document.getElementById('paper-title').value.trim();
      const subject = document.getElementById('paper-subject').value;
      const grade = document.getElementById('paper-grade').value;
      const syllabus = document.getElementById('paper-syllabus').value;
      const year = document.getElementById('paper-year').value;
      const fileUrl = document.getElementById('paper-file-url').value.trim();
      const isPremium = document.getElementById('paper-premium').checked;

      if (!title || !subject || !grade || !syllabus || !fileUrl) {
        alert('Please fill in all required fields including the file URL.');
        return;
      }

      const safeUrl = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(fileUrl) : fileUrl;
      if (safeUrl === '#') { alert('Please enter a valid URL.'); return; }

      this.textContent = 'Saving...';
      this.disabled = true;

      const success = await window.ZedLearnDB.insertPastPaper({
        title: title,
        subject: subject,
        grade: grade,
        syllabus: syllabus,
        year: year ? parseInt(year) : null,
        file_url: safeUrl,
        is_premium: isPremium
      });

      if (success) {
        if (window.ZedLearnDB) await window.ZedLearnDB.addNotification('New past paper added: ' + title, 'paper');
        document.getElementById('paper-success').style.display = 'block';
        document.getElementById('paper-title').value = '';
        document.getElementById('paper-file-url').value = '';
      } else {
        alert('Failed to save. Please try again.');
      }

      this.textContent = 'Save Past Paper';
      this.disabled = false;
    });
  }


  // ===== UPLOAD SCRIPT =====
  const uploadScriptBtn = document.getElementById('upload-script-btn');
  if (uploadScriptBtn && window.ZedLearnDB) {
    uploadScriptBtn.addEventListener('click', async function() {
      const title = document.getElementById('script-title').value.trim();
      const subject = document.getElementById('script-subject').value;
      const grade = document.getElementById('script-grade').value;
      const fileUrl = document.getElementById('script-file-url').value.trim();
      const description = document.getElementById('script-description').value.trim();

      if (!title || !subject || !grade || !fileUrl) {
        alert('Please fill in all required fields.');
        return;
      }

      const safeUrl = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(fileUrl) : fileUrl;
      if (safeUrl === '#') { alert('Please enter a valid URL.'); return; }

      this.textContent = 'Saving...';
      this.disabled = true;

      const success = await window.ZedLearnDB.insertLessonScript({
        title: title,
        subject: subject,
        grade: grade,
        file_url: safeUrl,
        description: description
      });

      if (success) {
        await window.ZedLearnDB.addNotification('New lesson script added: ' + title, 'script');
        document.getElementById('script-success').style.display = 'block';
        document.getElementById('script-title').value = '';
        document.getElementById('script-file-url').value = '';
      } else {
        alert('Failed to save. Please try again.');
      }

      this.textContent = 'Save Lesson Script';
      this.disabled = false;
    });
  }


  // ===== UPLOAD BOOK =====
  const uploadBookBtn = document.getElementById('upload-book-btn');
  if (uploadBookBtn && window.ZedLearnDB) {
    uploadBookBtn.addEventListener('click', async function() {
      const title = document.getElementById('book-title').value.trim();
      const author = document.getElementById('book-author').value.trim();
      const type = document.getElementById('book-type').value;
      const grade = document.getElementById('book-grade').value;
      const subject = document.getElementById('book-subject').value;
      const fileUrl = document.getElementById('book-file-url').value.trim();

      if (!title || !type || !fileUrl) {
        alert('Please fill in all required fields.');
        return;
      }

      const safeUrl = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(fileUrl) : fileUrl;
      if (safeUrl === '#') { alert('Please enter a valid URL.'); return; }

      this.textContent = 'Saving...';
      this.disabled = true;

      const success = await window.ZedLearnDB.insertBook({
        title: title,
        author: author,
        book_type: type,
        grade: grade,
        subject: subject,
        file_url: safeUrl
      });

      if (success) {
        await window.ZedLearnDB.addNotification('New book added: ' + title, 'book');
        document.getElementById('book-success').style.display = 'block';
        document.getElementById('book-title').value = '';
        document.getElementById('book-file-url').value = '';
      } else {
        alert('Failed to save. Please try again.');
      }

      this.textContent = 'Save Book';
      this.disabled = false;
    });
  }


  // ===== UPLOAD VIDEO =====
  const uploadVideoBtn = document.getElementById('upload-video-btn');
  if (uploadVideoBtn && window.ZedLearnDB) {
    uploadVideoBtn.addEventListener('click', async function() {
      const title = document.getElementById('video-title').value.trim();
      const subject = document.getElementById('video-subject').value;
      const grade = document.getElementById('video-grade').value;
      const url = document.getElementById('video-url').value.trim();
      const description = document.getElementById('video-description').value.trim();

      if (!title || !subject || !grade || !url) {
        alert('Please fill in all required fields.');
        return;
      }

      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
      if (!youtubeRegex.test(url)) {
        alert('Please enter a valid YouTube URL.');
        return;
      }

      this.textContent = 'Saving...';
      this.disabled = true;

      const success = await window.ZedLearnDB.insertVideo({
        title: title,
        subject: subject,
        grade: grade,
        youtube_url: url,
        description: description
      });

      if (success) {
        await window.ZedLearnDB.addNotification('New video added: ' + title, 'video');
        document.getElementById('video-success').style.display = 'block';
        document.getElementById('video-title').value = '';
        document.getElementById('video-url').value = '';
        if (videoPreview) videoPreview.innerHTML = '<p style="color:var(--admin-text-muted); text-align:center; padding:2rem;">Paste a YouTube URL above to see preview</p>';
      } else {
        alert('Failed to save. Please try again.');
      }

      this.textContent = 'Save Video';
      this.disabled = false;
    });
  }


  // ===== SAVE SOCIAL LINKS =====
  const saveLinksBtn = document.getElementById('save-links-btn');
  if (saveLinksBtn && window.ZedLearnDB) {
    saveLinksBtn.addEventListener('click', async function() {
      this.textContent = 'Saving...';
      this.disabled = true;

      const platforms = [
        { platform: 'whatsapp_group', id: 'link-whatsapp-group' },
        { platform: 'whatsapp_channel', id: 'link-whatsapp-channel' },
        { platform: 'youtube', id: 'link-youtube' },
        { platform: 'telegram', id: 'link-telegram' },
        { platform: 'meet', id: 'link-meet' }
      ];

      let allOk = true;
      for (const item of platforms) {
        const el = document.getElementById(item.id);
        if (el && el.value.trim()) {
          const safeUrl = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeURL(el.value.trim()) : el.value.trim();
          const ok = await window.ZedLearnDB.updateSocialLink(item.platform, safeUrl);
          if (!ok) allOk = false;
        }
      }

      const successEl = document.getElementById('links-success');
      if (successEl) successEl.style.display = allOk ? 'block' : 'none';
      if (!allOk) alert('Some links failed to save. Please try again.');

      this.textContent = 'Save All Links';
      this.disabled = false;
    });
  }


  // ===== LOAD PENDING REVIEWS =====
  const commentsTable = document.getElementById('comments-table-body');
  if (commentsTable && window.ZedLearnDB) {
    const reviews = await window.ZedLearnDB.getPendingReviews();
    const countEl = document.getElementById('pending-count');
    if (countEl) countEl.textContent = reviews.length;

    if (reviews.length === 0) {
      commentsTable.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--admin-text-muted);">No pending reviews at this time.</td></tr>';
    } else {
      commentsTable.innerHTML = reviews.map(function(r) {
        const name = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.name) : r.name;
        const text = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.review_text) : r.review_text;
        return '<tr><td>' + name + '</td><td>' + text + '</td><td>' + r.rating + '/5</td><td>' + new Date(r.created_at).toLocaleDateString() + '</td><td><button class="admin-btn admin-btn-success" onclick="approveReviewAction(\'' + r.id + '\')">Approve</button> <button class="admin-btn admin-btn-danger" onclick="deleteReviewAction(\'' + r.id + '\')">Reject</button></td></tr>';
      }).join('');
    }
  }


  // ===== CHANGE PASSWORD =====
  const changePassBtn = document.getElementById('change-password-btn');
  if (changePassBtn && window.ZedLearnDB) {
    changePassBtn.addEventListener('click', async function() {
      const newPass = document.getElementById('new-password').value;
      const confirmPass = document.getElementById('confirm-password').value;

      if (newPass.length < 12) {
        alert('Password must be at least 12 characters long.');
        return;
      }
      if (newPass !== confirmPass) {
        alert('Passwords do not match.');
        return;
      }

      this.textContent = 'Changing...';
      this.disabled = true;

      const success = await window.ZedLearnDB.changeAdminPassword(newPass);
      if (success) {
        alert('Password changed successfully.');
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      } else {
        alert('Failed to change password. Please try again.');
      }

      this.textContent = 'Change Password';
      this.disabled = false;
    });
  }

});


// ===== APPROVE REVIEW =====
async function approveReviewAction(id) {
  if (window.ZedLearnDB) {
    const ok = await window.ZedLearnDB.approveReview(id);
    if (ok) {
      const row = document.querySelector('[data-id="' + id + '"]');
      if (row) row.remove();
      location.reload();
    }
  }
}


// ===== DELETE REVIEW =====
async function deleteReviewAction(id) {
  if (confirm('Are you sure you want to reject and delete this review?')) {
    if (window.ZedLearnDB) {
      const ok = await window.ZedLearnDB.deleteReview(id);
      if (ok) location.reload();
    }
  }
}
