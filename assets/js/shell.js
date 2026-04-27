---
---
(function () {
  const root = document.documentElement;

  // -------- Theme ----------
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

  // -------- Command palette ----------
  const ITEMS = [
    { t: 'About',            u: '{{ "/" | relative_url }}',              s: '§ 0' },
    { t: 'Bookshelf',        u: '{{ "/books/" | relative_url }}',        s: '§ 0.5' },
    { t: 'Blog',             u: '{{ "/blog/" | relative_url }}',         s: '§ 1' },
    { t: 'Publications',     u: '{{ "/publications/" | relative_url }}', s: '§ 2' },
    { t: 'Projects',         u: '{{ "/projects/" | relative_url }}',     s: '§ 3' },
    { t: 'Talks',            u: '{{ "/talks/" | relative_url }}',        s: '§ 4' },
    { t: 'Curriculum Vitæ', u: '{{ "/cv/" | relative_url }}',           s: '§ 5' },
    { t: 'Teaching',         u: '{{ "/teaching/" | relative_url }}',     s: '§ 6' },
    { t: 'Toggle theme',     u: '#theme',                                 s: 'act' },
    { t: 'Email',            u: 'mailto:itsme@menraromial.com',           s: 'mail' }
  ];

  function buildPalette() {
    const overlay = document.createElement('div');
    overlay.className = 'cmd-overlay';
    overlay.innerHTML = `
      <div class="cmd" role="dialog" aria-label="Command palette">
        <div class="cmd-head">
          <span class="glyph">&rsaquo;_</span>
          <input type="text" placeholder="Jump to section, article, or setting…" />
          <span class="glyph">esc</span>
        </div>
        <ul></ul>
      </div>`;
    document.body.appendChild(overlay);

    const ul    = overlay.querySelector('ul');
    const inp   = overlay.querySelector('input');
    let sel = 0;

    function draw(q) {
      const filtered = ITEMS.filter(i => i.t.toLowerCase().includes(q.toLowerCase()));
      ul.innerHTML = filtered.map((i, idx) =>
        `<li class="${idx === sel ? 'sel' : ''}" data-u="${i.u}"><span>${i.t}</span><small>${i.s}</small></li>`
      ).join('');
      ul.querySelectorAll('li').forEach((li, idx) => {
        li.addEventListener('mouseenter', () => {
          ul.querySelectorAll('li').forEach(x => x.classList.remove('sel'));
          li.classList.add('sel'); sel = idx;
        });
        li.addEventListener('click', () => go(li.dataset.u));
      });
      return filtered;
    }

    function go(u) {
      if (u === '#theme') { window.__toggleTheme(); close(); return; }
      window.location.href = u;
    }
    function open()  { overlay.classList.add('on'); inp.value = ''; sel = 0; draw(''); setTimeout(() => inp.focus(), 20); }
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
  function buildSidenotes() {
    document.querySelectorAll('.sn-ref').forEach(n => {
      n.textContent = n.dataset.num;
      const tip = document.createElement('div');
      tip.className = 'sn-tooltip';
      tip.dataset.num = n.dataset.num + '.';
      tip.textContent = n.dataset.text;
      document.body.appendChild(tip);
      n.addEventListener('mouseenter', () => {
        const r = n.getBoundingClientRect();
        tip.style.left = Math.min(window.innerWidth - 300, r.left) + 'px';
        tip.style.top  = (r.bottom + 8) + 'px';
        tip.classList.add('on');
      });
      n.addEventListener('mouseleave', () => tip.classList.remove('on'));
    });
  }

  // -------- Auto TOC ----------
  function buildToc() {
    const prose = document.getElementById('article-prose');
    const nav   = document.getElementById('toc-nav');
    if (!prose || !nav) return;
    const headings = prose.querySelectorAll('h2, h3');
    if (!headings.length) return;
    let num = 0;
    headings.forEach(h => {
      if (!h.id) {
        h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      const a   = document.createElement('a');
      const isH3 = h.tagName === 'H3';
      if (!isH3) num++;
      a.innerHTML = (isH3 ? '&nbsp;&nbsp;&rsaquo;&nbsp;' : '&sect;&nbsp;' + num + '.&nbsp;') + h.textContent;
      a.href = '#' + h.id;
      if (isH3) a.style.paddingLeft = '20px';
      nav.appendChild(a);
    });
    const links = nav.querySelectorAll('a');
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('on'));
          const active = nav.querySelector('a[href="#' + e.target.id + '"]');
          if (active) active.classList.add('on');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px' }).observe
    headings.forEach(h => {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            links.forEach(l => l.classList.remove('on'));
            const a = nav.querySelector('a[href="#' + e.target.id + '"]');
            if (a) a.classList.add('on');
          }
        });
      }, { rootMargin: '0px 0px -70% 0px' }).observe(h);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildPalette();
    buildSidenotes();
    buildToc();
    const btn = document.querySelector('[data-theme-btn]');
    if (btn) btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☽ ink' : '☼ paper';
  });
})();
