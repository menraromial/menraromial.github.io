/* Shared shell: theme toggle, Ctrl+K palette, sidenotes */
(function () {
  // -------- Theme ----------
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');

  window.__toggleTheme = function () {
    const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (now === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    localStorage.setItem('theme', now);
    const btn = document.querySelector('[data-theme-btn]');
    if (btn) btn.textContent = now === 'dark' ? '☽ ink' : '☼ paper';
  };

  // -------- Palette ----------
  const ITEMS = [
    { t: 'About',         u: 'about.html',        s: '§ 0' },
    { t: 'Bookshelf',     u: 'bookshelf.html',    s: '§ 0.5' },
    { t: 'Blog · index',  u: 'blog.html',         s: '§ 1' },
    { t: 'Blog · powercap-utils guide',       u: 'article.html',   s: '§ 1.3' },
    { t: 'Publications',  u: 'publications.html', s: '§ 2' },
    { t: 'Projects',      u: 'projects.html',     s: '§ 3' },
    { t: 'Talks',         u: 'talks.html',        s: '§ 4' },
    { t: 'Curriculum Vitæ',u:'cv.html',           s: '§ 5' },
    { t: 'Teaching',      u: 'teaching.html',     s: '§ 6' },
    { t: 'Toggle theme',  u: '#theme',            s: 'act' },
    { t: 'Email — itsme@menraromial.com', u:'mailto:itsme@menraromial.com', s:'mail'}
  ];

  function renderPalette() {
    const overlay = document.querySelector('.cmd-overlay');
    if (!overlay) return;
    const ul = overlay.querySelector('ul');
    const inp = overlay.querySelector('input');
    let sel = 0;

    function draw(q) {
      const filtered = ITEMS.filter(i => i.t.toLowerCase().includes(q.toLowerCase()));
      ul.innerHTML = filtered.map((i, idx) =>
        `<li class="${idx === sel ? 'sel' : ''}" data-u="${i.u}"><span>${i.t}</span><small>${i.s}</small></li>`
      ).join('');
      ul.querySelectorAll('li').forEach((li, idx) => {
        li.addEventListener('mouseenter', () => {
          ul.querySelectorAll('li').forEach(x => x.classList.remove('sel'));
          li.classList.add('sel');
          sel = idx;
        });
        li.addEventListener('click', () => go(li.dataset.u));
      });
      return filtered;
    }
    function go(u) {
      if (u === '#theme') { window.__toggleTheme(); close(); return; }
      window.location.href = u;
    }
    function open() {
      overlay.classList.add('on');
      inp.value = ''; sel = 0; draw('');
      setTimeout(() => inp.focus(), 20);
    }
    function close() { overlay.classList.remove('on'); }

    inp.addEventListener('input', e => { sel = 0; draw(e.target.value); });
    inp.addEventListener('keydown', e => {
      const filtered = ITEMS.filter(i => i.t.toLowerCase().includes(inp.value.toLowerCase()));
      if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, filtered.length - 1); draw(inp.value); e.preventDefault(); }
      if (e.key === 'ArrowUp')   { sel = Math.max(sel - 1, 0); draw(inp.value); e.preventDefault(); }
      if (e.key === 'Enter')     { if (filtered[sel]) go(filtered[sel].u); }
      if (e.key === 'Escape')    { close(); }
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    window.__openCmd = open;

    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });
  }

  // -------- Sidenotes (Tufte hover) ----------
  function renderSidenotes() {
    const tips = document.createElement('div');
    document.body.appendChild(tips);
    const notes = document.querySelectorAll('.sn-ref');
    let current = null;
    notes.forEach((n) => {
      const num = n.dataset.num;
      const text = n.dataset.text;
      n.textContent = num;
      const tip = document.createElement('div');
      tip.className = 'sn-tooltip';
      tip.dataset.num = num + '.';
      tip.textContent = text;
      document.body.appendChild(tip);
      n.addEventListener('mouseenter', () => {
        const r = n.getBoundingClientRect();
        tip.style.left = Math.min(window.innerWidth - 300, r.left) + 'px';
        tip.style.top  = (r.bottom + window.scrollY + 8) + 'px';
        tip.classList.add('on');
        current = tip;
      });
      n.addEventListener('mouseleave', () => tip.classList.remove('on'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPalette();
    renderSidenotes();
    // theme button label
    const btn = document.querySelector('[data-theme-btn]');
    if (btn) btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☽ ink' : '☼ paper';
  });
})();
