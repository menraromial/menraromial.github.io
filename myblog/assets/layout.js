/* Renders the shared masthead + footer into any page that includes it. */
(function () {
  const here = (document.body.dataset.page || '').toLowerCase();
  const NAV = [
    ['about',        'About',         'about.html'],
    ['bookshelf',    'Bookshelf',     'bookshelf.html'],
    ['blog',         'Blog',          'blog.html'],
    ['publications', 'Publications',  'publications.html'],
    ['projects',     'Projects',      'projects.html'],
    ['talks',        'Talks',         'talks.html'],
    ['cv',           'Curriculum Vitæ','cv.html'],
    ['teaching',     'Teaching',      'teaching.html']
  ];

  const volume = document.body.dataset.volume || 'Vol. III — No. 2';
  const issueDate = document.body.dataset.issuedate || 'Nantes · April MMXXVI';

  const mast = document.querySelector('[data-mount="masthead"]');
  if (mast) {
    mast.innerHTML = `
      <header class="masthead">
        <a class="brand" href="about.html">
          <small>Journal of Energy-Aware Computing</small>
          MENRA · W · ROMIAL
        </a>
        <nav>
          ${NAV.map(([k,l,u]) => `<a href="${u}" class="${k===here?'active':''}">${l}</a>`).join('')}
        </nav>
        <div class="tools">
          <button class="kbd" data-theme-btn onclick="__toggleTheme()">☼ paper</button>
          <button class="kbd" onclick="__openCmd()">⌘ K</button>
        </div>
      </header>
      <div class="issue-bar">
        <span>${volume}</span>
        <span>ISSN 2026 · 0442 — Open Access</span>
        <span>${issueDate}</span>
      </div>
    `;
  }

  const foot = document.querySelector('[data-mount="footer"]');
  if (foot) {
    foot.innerHTML = `
      <footer class="sheet">
        <span>© MMXXVI · M · W · R</span>
        <span>Set in EB Garamond &amp; Source Serif · Composed with love, not LaTeX</span>
        <span>itsme@menraromial.com</span>
      </footer>
    `;
  }

  // Command palette overlay
  const cmd = document.createElement('div');
  cmd.className = 'cmd-overlay';
  cmd.innerHTML = `
    <div class="cmd" role="dialog" aria-label="Command palette">
      <div class="cmd-head">
        <span class="glyph">&rsaquo;_</span>
        <input type="text" placeholder="Jump to section, article, or setting…" />
        <span class="glyph">esc</span>
      </div>
      <ul></ul>
    </div>`;
  document.body.appendChild(cmd);
})();
