/* ============================================================
   PULSE.IO — SOCIAL MEDIA DASHBOARD
   script.js
   ============================================================ */

'use strict';

/* ── DATA ─────────────────────────────────────────────────── */
const DATA = {
  growth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    followers: [180, 195, 210, 220, 230, 240, 248, 255, 260, 268, 275, 284],
    impressions: [850, 920, 1000, 1080, 1150, 1250, 1380, 1480, 1560, 1680, 1750, 1800],
  },
  sources: [
    { label: 'Organic', pct: 38, color: '#7c6ef5' },
    { label: 'Paid', pct: 22, color: '#e879a0' },
    { label: 'Referral', pct: 26, color: '#34d399' },
    { label: 'Direct', pct: 14, color: '#fbbf24' },
  ],
  engagement: [
    { label: 'Likes', value: 48200, max: 50000, color: '#7c6ef5' },
    { label: 'Comments', value: 12800, max: 50000, color: '#e879a0' },
    { label: 'Shares', value: 8400, max: 50000, color: '#34d399' },
    { label: 'Saves', value: 21500, max: 50000, color: '#fbbf24' },
    { label: 'Profile Visits', value: 5900, max: 50000, color: '#38bdf8' },
  ],
  audienceAge: [
    { label: '18–24', pct: 42 },
    { label: '25–34', pct: 31 },
    { label: '35–44', pct: 17 },
    { label: '45+', pct: 10 },
  ],
  scheduled: [
    { platform: 'instagram', caption: 'Behind-the-screen studio tour 🎬', date: 'Today, 4:00 PM', type: 'Reel' },
    { platform: 'twitter', caption: 'Thread: 10 tips for better lighting 💡', date: 'Today, 5:00 PM', type: 'Thread' },
    { platform: 'youtube', caption: 'How I edit my Reels in 10 min', date: 'Tomorrow, 9:00 AM', type: 'Video' },
    { platform: 'instagram', caption: 'April product drop announcement 🔥', date: 'Mar 30, 11:00 AM', type: 'Story' },
  ],
  topContent: [
    { rank: 1, type: 'video', emoji: '▶', caption: 'Morning routine productivity hack — 4AM club joins 💼', meta: 'Video · 5h · 3.2K impressions', likes: '18.4K', eng: '6.7%' },
    { rank: 2, type: 'thread', emoji: '🧵', caption: 'I tried every AI video editor for 30 days — here\'s the truth', meta: 'Thread · Mar 16 · 5.8K impressions', likes: '24.5K', eng: '6.2%' },
    { rank: 3, type: 'carousel', emoji: '🖼', caption: 'Twitter thread: Lessons from 0 to 100K followers (the real one)', meta: 'Thread · Mar 14 · 2.1K impressions', likes: '4.8K', eng: '5.5%' },
    { rank: 4, type: 'carousel', emoji: '🖼', caption: 'Minimal desk setup that changed how I work — carousel', meta: 'Carousel · Mar 12 · 1.8K impressions', likes: '11.2K', eng: '4.9%' },
  ],
  heatmap: {
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    times: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    grid: [
      [1, 2, 2, 3, 4, 5, 3],
      [2, 3, 4, 5, 5, 4, 2],
      [1, 2, 3, 4, 4, 3, 1],
      [2, 4, 5, 5, 4, 3, 2],
      [3, 5, 5, 4, 5, 5, 3],
      [1, 2, 3, 3, 4, 5, 4],
    ],
  },
  sparklines: {
    spark1: [60, 72, 65, 80, 75, 90, 88, 95],
    spark2: [70, 68, 80, 78, 85, 92, 88, 100],
    spark3: [90, 88, 85, 87, 80, 75, 78, 73],
    spark4: [85, 90, 87, 80, 78, 75, 76, 72],
  },
};

/* ── THEME ────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '🌙' : '☀️';
  // redraw canvases after theme switch
  setTimeout(() => { drawGrowthChart(); drawSourcesChart(); drawSparklines(); }, 50);
});

/* ── SIDEBAR TOGGLE ───────────────────────────────────────── */
document.getElementById('sidebarToggle').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
});

/* ── NAV LINKS (SPA-like) ─────────────────────────────────── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ── PLATFORM TABS ────────────────────────────────────────── */
document.querySelectorAll('.platform-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showToast(`Showing ${tab.textContent} data`, 'success');
  });
});

/* ── TOAST ────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  let tc = document.querySelector('.toast-container');
  if (!tc) {
    tc = document.createElement('div');
    tc.className = 'toast-container';
    document.body.appendChild(tc);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ── ANIMATED COUNTER ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    let current = target * ease;
    let display;
    if (target >= 1000000) display = (current / 1000000).toFixed(1) + 'M';
    else if (target >= 1000) display = (current / 1000).toFixed(1) + 'K';
    else if (Number.isInteger(target)) display = Math.round(current).toString();
    else display = current.toFixed(1);
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ── SPARKLINES ───────────────────────────────────────────── */
function drawSparkline(canvasId, data, color) {
  const container = document.getElementById(canvasId);
  if (!container) return;
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  const rect = container.getBoundingClientRect();
  const w = rect.width || 180;
  const h = rect.height || 40;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const dw = w; const dh = h;
  const xStep = dw / (data.length - 1);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({ x: i * xStep, y: dh - ((v - min) / range) * (dh * 0.7) - dh * 0.1 }));
  // gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, dh);
  grad.addColorStop(0, color.replace(')', ',0.3)').replace('rgb', 'rgba').replace('#', '').replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, (_, r, g, b) => `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},0.3)`) || 'rgba(124,110,245,0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, dh);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, dh);
  ctx.closePath();
  ctx.fillStyle = 'rgba(124,110,245,0.15)';
  ctx.fill();
  // line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // last dot
  const last = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSparklines() {
  const colors = ['#7c6ef5', '#e879a0', '#34d399', '#fbbf24'];
  Object.entries(DATA.sparklines).forEach(([id, data], i) => {
    drawSparkline(id, data, colors[i]);
  });
}

/* ── GROWTH CHART (Canvas) ────────────────────────────────── */
function drawGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;
  const parent = canvas.parentElement;
  const w = parent.clientWidth || 600;
  const h = 160;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;
  canvas.style.width = '100%';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const padL = 44, padR = 16, padT = 16, padB = 32;
  const dw = w - padL - padR;
  const dh = h - padT - padB;
  const labels = DATA.growth.labels;
  const followersK = DATA.growth.followers;
  const impressionsH = DATA.growth.impressions;

  const maxF = Math.max(...followersK) * 1.15;
  const maxI = Math.max(...impressionsH) * 1.15;

  const xPos = (i) => padL + (i / (labels.length - 1)) * dw;
  const yF = (v) => padT + dh - (v / maxF) * dh;
  const yI = (v) => padT + dh - (v / maxI) * dh;

  const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (dh / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + dw, y); ctx.stroke();
  }

  // X-axis labels
  ctx.fillStyle = textColor;
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    if (i % 2 === 0) ctx.fillText(l, xPos(i), h - 10);
  });

  // Draw smooth line helper
  function drawLine(points, color, yFn, data) {
    const grad = ctx.createLinearGradient(0, padT, 0, padT + dh);
    const [r, g, b] = color === '#7c6ef5' ? [124, 110, 245] : [232, 121, 160];
    grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.beginPath();
    ctx.moveTo(xPos(0), padT + dh);
    data.forEach((v, i) => ctx.lineTo(xPos(i), yFn(v)));
    ctx.lineTo(xPos(data.length - 1), padT + dh);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xPos(i), yFn(v));
      else {
        const cpx1 = xPos(i - 1) + (xPos(i) - xPos(i - 1)) / 2;
        const cpx2 = cpx1;
        ctx.bezierCurveTo(cpx1, yFn(data[i - 1]), cpx2, yFn(v), xPos(i), yFn(v));
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots
    data.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xPos(i), yFn(v), 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = isDark ? '#1a1f2e' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });
  }

  drawLine(null, '#7c6ef5', yF, followersK);
  drawLine(null, '#e879a0', yI, impressionsH);

  // Y-axis labels
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';
  ctx.font = '10px Inter, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const v = (maxF / 4) * (4 - i);
    const y = padT + (dh / 4) * i;
    ctx.fillText(v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v.toFixed(0), padL - 6, y + 4);
  }
}

/* ── SOURCES DONUT CHART ──────────────────────────────────── */
function drawSourcesChart() {
  const canvas = document.getElementById('sourcesChart');
  if (!canvas) return;
  const size = 180;
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const cx = size / 2, cy = size / 2, r = 70, innerR = 46;
  let startAngle = -Math.PI / 2;

  DATA.sources.forEach(src => {
    const slice = (src.pct / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = src.color;
    ctx.shadowColor = src.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    startAngle += slice;
  });

  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#1a1f2e' : '#ffffff';
  ctx.fill();

  // Build legend
  const legend = document.getElementById('sourcesLegend');
  if (legend && !legend.dataset.built) {
    legend.dataset.built = '1';
    DATA.sources.forEach(src => {
      legend.innerHTML += `
        <div class="src-item">
          <span class="src-dot" style="background:${src.color};box-shadow:0 0 6px ${src.color}"></span>
          <span>${src.label}</span>
          <span class="src-pct">${src.pct}%</span>
        </div>`;
    });
  }
}

/* ── ENGAGEMENT BARS ──────────────────────────────────────── */
function renderEngagementBars() {
  const container = document.getElementById('engagementBars');
  if (!container) return;
  DATA.engagement.forEach(item => {
    const pct = ((item.value / item.max) * 100).toFixed(1);
    container.innerHTML += `
      <div class="eng-bar-item">
        <div class="eng-bar-header">
          <span class="eng-bar-label">${item.label}</span>
          <span class="eng-bar-value">${item.value.toLocaleString()}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="background:${item.color}" data-pct="${pct}"></div>
        </div>
      </div>`;
  });
  // Animate after a frame
  setTimeout(() => {
    container.querySelectorAll('.bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 100);
}

/* ── AGE BARS ─────────────────────────────────────────────── */
function renderAgeBars() {
  const container = document.getElementById('ageBars');
  if (!container) return;
  DATA.audienceAge.forEach(item => {
    container.innerHTML += `
      <div class="age-bar-row">
        <span class="age-bar-label">${item.label}</span>
        <div class="age-bar-track">
          <div class="age-bar-fill" data-pct="${item.pct}"></div>
        </div>
        <span class="age-bar-pct">${item.pct}%</span>
      </div>`;
  });
  setTimeout(() => {
    container.querySelectorAll('.age-bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 200);
}

/* ── SCHEDULED POSTS ──────────────────────────────────────── */
let scheduledPosts = [...DATA.scheduled];

function platIcon(p) {
  const m = { instagram: '📷', twitter: '🐦', youtube: '▶' };
  return m[p] || '📌';
}

function renderScheduledList() {
  const ul = document.getElementById('scheduledList');
  if (!ul) return;
  ul.innerHTML = '';
  if (!scheduledPosts.length) {
    ul.innerHTML = '<li style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">No scheduled posts</li>';
    return;
  }
  scheduledPosts.forEach((post, idx) => {
    const li = document.createElement('li');
    li.className = 'scheduled-item';
    li.innerHTML = `
      <div class="sched-platform ${post.platform}">
        <span>${platIcon(post.platform)}</span>
      </div>
      <div class="sched-info">
        <div class="sched-caption">${post.caption}</div>
        <div class="sched-meta">${post.date}</div>
      </div>
      <span class="sched-type-badge">${post.type}</span>`;
    li.addEventListener('click', () => {
      if (confirm(`Delete "${post.caption}"?`)) {
        scheduledPosts.splice(idx, 1);
        renderScheduledList();
        showToast('Post removed', 'success');
      }
    });
    ul.appendChild(li);
  });
}

/* Add Post Modal */
const modalOverlay = document.getElementById('modalOverlay');
const addPostBtn = document.getElementById('addPostBtn');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');

function openModal() { modalOverlay.classList.add('open'); }
function closeModal() { modalOverlay.classList.remove('open'); }

addPostBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

modalSave.addEventListener('click', () => {
  const caption = document.getElementById('postCaption').value.trim();
  const platform = document.getElementById('postPlatform').value.toLowerCase();
  const dt = document.getElementById('postDateTime').value;
  const type = document.getElementById('postType').value;
  if (!caption) { showToast('Please enter a caption', 'error'); return; }
  const date = dt ? new Date(dt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled';
  scheduledPosts.unshift({ platform, caption, date, type });
  renderScheduledList();
  closeModal();
  showToast('Post scheduled! 🎉', 'success');
  document.getElementById('postCaption').value = '';
  document.getElementById('postDateTime').value = '';
});

/* ── HEATMAP ─────────────────────────────────────────────── */
function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  const days = DATA.heatmap.days;
  const times = DATA.heatmap.times;
  const grid = DATA.heatmap.grid;

  // Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'heatmap-header-row';
  headerRow.innerHTML = '<span></span>' + days.map(d => `<span>${d}</span>`).join('');
  container.appendChild(headerRow);

  grid.forEach((row, ri) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'heatmap-row';
    rowEl.innerHTML = `<span class="heatmap-time-label">${times[ri]}</span>`;
    row.forEach((level, ci) => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.dataset.level = level;
      cell.title = `${times[ri]} on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][ci]}: Engagement level ${level}/5`;
      rowEl.appendChild(cell);
    });
    container.appendChild(rowEl);
  });
}

/* ── TOP PERFORMING CONTENT ───────────────────────────────── */
let activeFilter = 'all';

function renderTopContent(filter = 'all') {
  activeFilter = filter;
  const container = document.getElementById('topContentList');
  if (!container) return;
  container.innerHTML = '';
  const filtered = filter === 'all' ? DATA.topContent : DATA.topContent.filter(c => c.type === filter);
  filtered.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'content-item';
    el.style.animationDelay = `${idx * 0.07}s`;
    el.innerHTML = `
      <span class="content-rank ${item.rank === 1 ? 'content-rank-1' : ''}">${item.rank}</span>
      <div class="content-thumb ${item.type}">${item.emoji}</div>
      <div class="content-info">
        <div class="content-caption">${item.caption}</div>
        <div class="content-meta">
          <span class="content-type-badge">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
          <span class="dot">·</span>
          <span>${item.meta}</span>
        </div>
      </div>
      <div class="content-stats">
        <span class="stat-likes">${item.likes}</span>
        <span class="stat-eng-rate">${item.eng} ER</span>
      </div>`;
    container.appendChild(el);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTopContent(btn.dataset.filter);
  });
});

/* ── NOTIFICATION BUTTON ──────────────────────────────────── */
document.getElementById('notifBtn').addEventListener('click', () => {
  showToast('No new notifications', 'success');
});

/* ── INTERSECTION OBSERVER (animate on entry) ─────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value[data-target]');
      statValues.forEach(animateCounter);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

/* ── RESIZE REDRAW ────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawGrowthChart();
    drawSparklines();
  }, 200);
});

/* ── INIT ─────────────────────────────────────────────────── */
function init() {
  renderEngagementBars();
  renderAgeBars();
  renderScheduledList();
  renderHeatmap();
  renderTopContent();

  // Observe stat cards for counter animation
  document.querySelectorAll('.stat-card').forEach(card => observer.observe(card));
  // Immediate trigger if visible
  setTimeout(() => {
    document.querySelectorAll('.stat-value[data-target]').forEach(animateCounter);
  }, 300);

  // Charts need layout to settle
  setTimeout(() => {
    drawGrowthChart();
    drawSourcesChart();
    drawSparklines();
  }, 100);
}

document.addEventListener('DOMContentLoaded', init);
