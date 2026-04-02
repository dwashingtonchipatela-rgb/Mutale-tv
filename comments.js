document.addEventListener('DOMContentLoaded', function() {

  let selectedRating = 0;
  const stars = document.querySelectorAll('.star-btn');

  stars.forEach(function(star) {
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.dataset.value);
      stars.forEach(function(s, i) { s.classList.toggle('active', i < val); });
    });
    star.addEventListener('mouseout', function() {
      stars.forEach(function(s, i) { s.classList.toggle('active', i < selectedRating); });
    });
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.dataset.value);
      stars.forEach(function(s, i) { s.classList.toggle('active', i < selectedRating); });
    });
  });

  const submitBtn = document.getElementById('review-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {
      if (window.ZedLearnSecurity && window.ZedLearnSecurity.isBot('review-honeypot')) return;
      if (window.ZedLearnSecurity && !window.ZedLearnSecurity.rateLimiter.canSubmit('review')) {
        alert('Please wait before submitting again.');
        return;
      }
      const name = document.getElementById('review-name') ? document.getElementById('review-name').value : '';
      const text = document.getElementById('review-text') ? document.getElementById('review-text').value : '';
      const ageConfirmed = document.getElementById('age-confirm') ? document.getElementById('age-confirm').checked : false;
      if (!ageConfirmed) { alert('Please confirm you agree to the terms.'); return; }
      if (selectedRating === 0) { alert('Please select a star rating.'); return; }
      if (!name.trim() || !text.trim()) { alert('Please fill in all fields.'); return; }
      const safeName = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(name) : name;
      const safeText = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(text) : text;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      if (window.ZedLearnDB) {
        const success = await window.ZedLearnDB.submitReviewToDB({ name: safeName, text: safeText, rating: selectedRating });
        if (success) {
          if (window.ZedLearnSecurity) window.ZedLearnSecurity.rateLimiter.record('review');
          const notice = document.getElementById('review-pending-notice');
          if (notice) notice.classList.add('show');
          submitBtn.textContent = 'Submitted';
          if (document.getElementById('review-name')) document.getElementById('review-name').value = '';
          if (document.getElementById('review-text')) document.getElementById('review-text').value = '';
          if (document.getElementById('age-confirm')) document.getElementById('age-confirm').checked = false;
          selectedRating = 0;
          stars.forEach(function(s) { s.classList.remove('active'); });
        } else {
          alert('Something went wrong. Please try again.');
          submitBtn.textContent = 'Submit Review';
          submitBtn.disabled = false;
        }
      }
    });
  }

  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList && window.ZedLearnDB) {
    window.ZedLearnDB.getApprovedReviews().then(function(reviews) {
      if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem;">No reviews yet. Be the first to leave one.</p>';
        return;
      }
      reviewsList.innerHTML = reviews.map(function(r) {
        const name = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.name) : r.name;
        const text = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.review_text) : r.review_text;
        const starsHtml = Array(r.rating).fill('<span style="color:#f4b400;">&#9733;</span>').join('') + Array(5 - r.rating).fill('<span style="color:#dadde1;">&#9733;</span>').join('');
        return '<div class="review-card"><div class="review-header"><span class="review-name">' + name + '</span><span>' + starsHtml + '</span></div><p class="review-text">' + text + '</p></div>';
      }).join('');
    });
  }

});
