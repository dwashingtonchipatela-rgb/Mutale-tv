// ============================================
// ONLY CHANGE THESE TWO LINES
// ============================================
const SUPABASE_URL = 'https://epptqdjickazlcqihusl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcHRxZGppY2themxjcWlodXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MzkxNDEsImV4cCI6MjA5MDUxNTE0MX0.DOcfxKlT27WpFtMkrrpmRV3M4jb0J3uzjZcGk_7C9S8';
// ============================================

function loadSupabaseLibrary(callback) {
  if (window._supabaseClient) { callback(window._supabaseClient); return; }
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = function() {
    const { createClient } = supabase;
    window._supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    callback(window._supabaseClient);
  };
  script.onerror = function() { console.error('Supabase failed to load'); };
  document.head.appendChild(script);
}
window.loadSupabase = loadSupabaseLibrary;

async function getPastPapers(filters) {
  filters = filters || {};
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      let query = db.from('past_papers').select('*').order('created_at', { ascending: false });
      if (filters.grade && filters.grade !== 'all') query = query.eq('grade', filters.grade);
      if (filters.subject && filters.subject !== 'all') query = query.eq('subject', filters.subject);
      if (filters.syllabus && filters.syllabus !== 'all') query = query.eq('syllabus', filters.syllabus);
      if (filters.year && filters.year !== 'all') query = query.eq('year', parseInt(filters.year));
      if (filters.search && filters.search.length > 1) query = query.ilike('title', '%' + filters.search + '%');
      const { data, error } = await query;
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function getLessonScripts(filters) {
  filters = filters || {};
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      let query = db.from('lesson_scripts').select('*').order('created_at', { ascending: false });
      if (filters.grade && filters.grade !== 'all') query = query.eq('grade', filters.grade);
      if (filters.subject && filters.subject !== 'all') query = query.eq('subject', filters.subject);
      if (filters.search && filters.search.length > 1) query = query.ilike('title', '%' + filters.search + '%');
      const { data, error } = await query;
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function getBooks(filters) {
  filters = filters || {};
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      let query = db.from('books').select('*').order('created_at', { ascending: false });
      if (filters.type && filters.type !== 'all') query = query.eq('book_type', filters.type);
      if (filters.grade && filters.grade !== 'all') query = query.eq('grade', filters.grade);
      if (filters.subject && filters.subject !== 'all') query = query.eq('subject', filters.subject);
      if (filters.search && filters.search.length > 1) query = query.ilike('title', '%' + filters.search + '%');
      const { data, error } = await query;
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function getVideos(filters) {
  filters = filters || {};
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      let query = db.from('videos').select('*').order('created_at', { ascending: false });
      if (filters.grade && filters.grade !== 'all') query = query.eq('grade', filters.grade);
      if (filters.subject && filters.subject !== 'all') query = query.eq('subject', filters.subject);
      if (filters.search && filters.search.length > 1) query = query.ilike('title', '%' + filters.search + '%');
      const { data, error } = await query;
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function getSocialLinks() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data, error } = await db.from('social_links').select('*');
      if (error) { resolve({}); return; }
      const links = {};
      (data || []).forEach(function(row) { links[row.platform] = row.url; });
      resolve(links);
    });
  });
}

async function updateSocialLink(platform, url) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('social_links').update({ url: url, updated_at: new Date().toISOString() }).eq('platform', platform);
      resolve(!error);
    });
  });
}

async function getApprovedReviews() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data, error } = await db.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(20);
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function submitReviewToDB(review) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('reviews').insert([{ name: review.name, review_text: review.text, rating: review.rating, approved: false }]);
      resolve(!error);
    });
  });
}

async function getPendingReviews() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data, error } = await db.from('reviews').select('*').eq('approved', false).order('created_at', { ascending: false });
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function approveReview(id) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('reviews').update({ approved: true }).eq('id', id);
      resolve(!error);
    });
  });
}

async function deleteReview(id) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('reviews').delete().eq('id', id);
      resolve(!error);
    });
  });
}

async function insertPastPaper(data) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('past_papers').insert([data]);
      resolve(!error);
    });
  });
}

async function insertLessonScript(data) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('lesson_scripts').insert([data]);
      resolve(!error);
    });
  });
}

async function insertBook(data) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('books').insert([data]);
      resolve(!error);
    });
  });
}

async function insertVideo(data) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('videos').insert([data]);
      resolve(!error);
    });
  });
}

async function deleteResource(table, id) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from(table).delete().eq('id', id);
      resolve(!error);
    });
  });
}

async function getNotifications() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data, error } = await db.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
      if (error) { resolve([]); } else { resolve(data || []); }
    });
  });
}

async function addNotification(message, type) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.from('notifications').insert([{ message: message, type: type || 'general', is_read: false }]);
      resolve(!error);
    });
  });
}

async function adminLogin(email, password) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data, error } = await db.auth.signInWithPassword({ email: email, password: password });
      if (error) { resolve({ success: false, error: error.message }); }
      else { localStorage.setItem('zedlearn_admin_token', data.session.access_token); resolve({ success: true }); }
    });
  });
}

async function adminLogout() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      await db.auth.signOut();
      localStorage.removeItem('zedlearn_admin_token');
      resolve(true);
    });
  });
}

async function checkAdminSession() {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data } = await db.auth.getSession();
      resolve(data.session !== null);
    });
  });
}

async function changeAdminPassword(newPassword) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { error } = await db.auth.updateUser({ password: newPassword });
      resolve(!error);
    });
  });
}

async function incrementDownload(table, id) {
  return new Promise(function(resolve) {
    loadSupabaseLibrary(async function(db) {
      const { data } = await db.from(table).select('download_count').eq('id', id).single();
      if (data) { await db.from(table).update({ download_count: (data.download_count || 0) + 1 }).eq('id', id); }
      resolve(true);
    });
  });
}

window.ZedLearnDB = {
  getPastPapers, getLessonScripts, getBooks, getVideos,
  getSocialLinks, updateSocialLink,
  getApprovedReviews, submitReviewToDB, getPendingReviews, approveReview, deleteReview,
  insertPastPaper, insertLessonScript, insertBook, insertVideo, deleteResource,
  getNotifications, addNotification,
  adminLogin, adminLogout, checkAdminSession, changeAdminPassword, incrementDownload
};
