// ================================================
// ZEDLEARN ONLINE — SECURITY
// A Mutale TV Product
// ================================================

// ===== SANITIZE TEXT INPUT =====
// Removes dangerous characters from user input
// Prevents XSS attacks
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\0/g, '')
    .trim();
}


// ===== SANITIZE URL =====
// Blocks dangerous links
function sanitizeURL(url) {
  if (typeof url !== 'string') return '#';
  const t = url.trim().toLowerCase();
  if (t.startsWith('javascript:') || t.startsWith('vbscript:') || t.startsWith('data:') || t.startsWith('file:')) return '#';
  if (t.startsWith('http://') || t.startsWith('https://') || t.startsWith('/') || t.startsWith('#')) return url.trim();
  return '#';
}


// ===== VALIDATE EMAIL =====
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}


// ===== VALIDATE LENGTH =====
function validateLength(text, min, max) {
  if (typeof text !== 'string') return false;
  const l = text.trim().length;
  return l >= min && l <= max;
}


// ===== RATE LIMITER =====
const rateLimiter = {
  limits: { review: 30, contact: 60, search: 1, download: 3 },
  canSubmit: function(action) {
    const key = 'zl_rl_' + action;
    const last = localStorage.getItem(key);
    if (!last) return true;
    return (Date.now() - parseInt(last)) >= (this.limits[action] || 30) * 1000;
  },
  record: function(action) {
    localStorage.setItem('zl_rl_' + action, Date.now().toString());
  },
  remaining: function(action) {
    const key = 'zl_rl_' + action;
    const last = localStorage.getItem(key);
    if (!last) return 0;
    const remaining = Math.ceil((this.limits[action] || 30) - (Date.now() - parseInt(last)) / 1000);
    return remaining > 0 ? remaining : 0;
  }
};


// ===== HONEYPOT CHECK =====
function isBot(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return false;
  return field.value.length > 0;
}


// ===== FORM VALIDATOR =====
function validateForm(fields) {
  for (const field of fields) {
    if (!field.value || field.value.trim().length === 0) {
      return { valid: false, error: field.label + ' is required.' };
    }
    if (field.min && field.max && !validateLength(field.value, field.min, field.max)) {
      return { valid: false, error: field.label + ' must be between ' + field.min + ' and ' + field.max + ' characters.' };
    }
    if (field.type === 'email' && !validateEmail(field.value)) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
    if (field.type === 'url' && sanitizeURL(field.value) === '#') {
      return { valid: false, error: 'Please enter a valid URL.' };
    }
  }
  return { valid: true, error: null };
}


// ===== CHECK URL PARAMS FOR INJECTION =====
(function() {
  const params = new URLSearchParams(window.location.search);
  const dangerous = ['<script', 'javascript:', 'onerror=', 'onload='];
  params.forEach(function(value) {
    dangerous.forEach(function(pattern) {
      if (value.toLowerCase().includes(pattern)) {
        console.warn('ZedLearn Security: Suspicious URL parameter detected.');
      }
    });
  });
})();


// ===== PREVENT SCRIPT INJECTION IN INPUTS =====
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(function(input) {
    input.addEventListener('paste', function() {
      setTimeout(() => {
        if (this.value.toLowerCase().includes('<script') || this.value.toLowerCase().includes('javascript:')) {
          this.value = '';
          alert('Invalid content detected and removed.');
        }
      }, 0);
    });
  });
});


// ===== EXPORT =====
window.ZedLearnSecurity = {
  sanitizeInput,
  sanitizeURL,
  validateEmail,
  validateLength,
  validateForm,
  rateLimiter,
  isBot
};
