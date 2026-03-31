// ================================================
// ZEDLEARN ONLINE — COMMENTS & REVIEWS
// A Mutale TV Product
// ================================================

document.addEventListener('DOMContentLoaded', function() {

  // ===== STAR RATING =====
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


  // ===== SUBMIT REVIEW =====
  const submitBtn = document.getElementById('review-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {

      // Honeypot check
      if (window.ZedLearnSecurity && window.ZedLearnSecurity.isBot('review-honeypot')) return;

      // Rate limit check
      if (window.ZedLearnSecurity) {
        const limiter = window.ZedLearnSecurity.rateLimiter;
        if (!limiter.canSubmit('review')) {
          alert('Please wait ' + limiter.remaining('review') + ' seconds before submitting again.');
          return;
        }
      }

      const name = document.getElementById('review-name') ? document.getElementById('review-name').value : '';
      const text = document.getElementById('review-text') ? document.getElementById('review-text').value : '';
      const ageConfirmed = document.getElementById('age-confirm') ? document.getElementById('age-confirm').checked : false;

      // Validate
      if (!ageConfirmed) { alert('Please confirm you agree to the terms.'); return; }
      if (selectedRating === 0) { alert('Please select a star rating.'); return; }

      if (window.ZedLearnSecurity) {
        const validation = window.ZedLearnSecurity.validateForm([
          { value: name, label: 'Name', min: 2, max: 100 },
          { value: text, label: 'Review', min: 10, max: 500 }
        ]);
        if (!validation.valid) { alert(validation.error); return; }
      }

      // Sanitize
      const safeName = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(name) : name;
      const safeText = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(text) : text;

      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Save to Supabase
      if (window.ZedLearnDB) {
        const success = await window.ZedLearnDB.submitReviewToDB({
          name: safeName,
          text: safeText,
          rating: selectedRating
        });

        if (success) {
          if (window.ZedLearnSecurity) window.ZedLearnSecurity.rateLimiter.record('review');
          document.getElementById('review-pending-notice').classList.add('show');
          submitBtn.textContent = 'Submitted';
          document.getElementById('review-name').value = '';
          document.getElementById('review-text').value = '';
          document.getElementById('age-confirm').checked = false;
          selectedRating = 0;
          stars.forEach(s => s.classList.remove('active'));
        } else {
          alert('Something went wrong. Please try again.');
          submitBtn.textContent = 'Submit Review';
          submitBtn.disabled = false;
        }
      }
    });
  }


  // ===== LOAD APPROVED REVIEWS =====
  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList && window.ZedLearnDB) {
    window.ZedLearnDB.getApprovedReviews().then(function(reviews) {
      if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:2rem;">No reviews yet. Be the first to leave one.</p>';
        return;
      }
      reviewsList.innerHTML = reviews.map(function(r) {
        const name = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.name) : r.name;
        const text = window.ZedLearnSecurity ? window.ZedLearnSecurity.sanitizeInput(r.review_text) : r.review_text;
        const stars = Array(r.rating).fill('<span class="star-filled">&#9733;</span>').join('') +
                      Array(5 - r.rating).fill('<span class="star-empty">&#9733;</span>').join('');
        return '<div class="review-card"><div class="review-header"><span class="review-name">' + name + '</span><span class="review-stars">' + stars + '</span></div><p class="review-text">' + text + '</p></div>';
      }).join('');
    });
  }

});
