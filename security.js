function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;').replace(/\0/g,'').trim();
}

function sanitizeURL(url) {
  if (typeof url !== 'string') return '#';
  const t = url.trim().toLowerCase();
  if (t.startsWith('javascript:') || t.startsWith('vbscript:') || t.startsWith('data:') || t.startsWith('file:')) return '#';
  if (t.startsWith('http://') || t.startsWith('https://') || t.startsWith('/') || t.startsWith('#')) return url.trim();
  return '#';
}

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

function validateLength(text, min, max) {
  if (typeof text !== 'string') return false;
  const l = text.trim().length;
  return l >= min && l <= max;
}

const rateLimiter = {
  limits: { review: 30, contact: 60, search: 1, download: 3 },
  canSubmit: function(action) {
    const key = 'zl_rl_' + action;
    const last = localStorage.getItem(key);
    if (!last) return true;
    return (Date.now() - parseInt(last)) >= (this.limits[action] || 30) * 1000;
  },
  record: function(action) { localStorage.setItem('zl_rl_' + action, Date.now().toString()); },
  remaining: function(action) {
    const key = 'zl_rl_' + action;
    const last = localStorage.getItem(key);
    if (!last) return 0;
    const remaining = Math.ceil((this.limits[action] || 30) - (Date.now() - parseInt(last)) / 1000);
    return remaining > 0 ? remaining : 0;
  }
};

function isBot(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return false;
  return field.value.length > 0;
}

function validateForm(fields) {
  for (const field of fields) {
    if (!field.value || field.value.trim().length === 0) return { valid: false, error: field.label + ' is required.' };
    if (field.min && field.max && !validateLength(field.value, field.min, field.max)) return { valid: false, error: field.label + ' must be between ' + field.min + ' and ' + field.max + ' characters.' };
    if (field.type === 'email' && !validateEmail(field.value)) return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, error: null };
}

window.ZedLearnSecurity = { sanitizeInput, sanitizeURL, validateEmail, validateLength, validateForm, rateLimiter, isBot };
