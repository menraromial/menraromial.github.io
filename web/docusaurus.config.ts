import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE = 'https://menraromial.com';

// Blog slugs, shared by the redirects from the Hugo (/posts/...) and
// Jekyll (/blog/<year>/...) eras of the site.
const posts: [year: number, slug: string][] = [
  [2024, 'setup-k3s-cluster'],
  [2025, 'kubernetes-with-kubeadm-and-cri.io'],
  [2025, 'guide-building-custom-kubernetes-scheduler'],
  [2025, 'building-a-kubernetes-controller-with-kubebuilder-from-scratch'],
  [2025, 'comprehensive-guide-powercap-utils-linux'],
];

const legacyRedirects = [
  ...posts.map(([year, slug]) => ({
    to: `/blog/${slug}`,
    from: [`/posts/${slug}`, `/blog/${year}/${slug}`],
  })),
  // Removed post: send its old URLs to the blog index.
  {
    to: '/blog',
    from: ['/posts', '/posts/master-ci-ci-pipeline-locally', '/blog/2025/master-ci-ci-pipeline-locally'],
  },
  {
    to: '/news',
    from: [
      '/news/best-paper-nomination-europar-2026',
      '/news/europar-2026-paper-accepted',
      '/news/m2-intern-clement-obama',
    ],
  },
  {to: '/blog/volunteering-ucc-bdcat-2025', from: ['/news/volunteering-ucc-bdcat-2025']},
];

const person = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: 'Menra Romial',
      alternateName: ['Romial Menra', 'Menra Wedwang Romial', 'Wedwang Romial', 'Menra W. Romial', 'menraromial'],
      url: `${SITE}/`,
      image: `${SITE}/img/profile.jpg`,
      jobTitle: 'PhD Candidate in Computer Science',
      description:
        'PhD candidate working on power management in cloud infrastructures, from Intel RAPL power limiting to energy-aware Kubernetes orchestration.',
      email: 'mailto:itsme@menraromial.com',
      affiliation: [
        {'@type': 'Organization', name: 'IMT Atlantique', url: 'https://www.imt-atlantique.fr'},
        {'@type': 'Organization', name: 'Inria', url: 'https://www.inria.fr'},
        {'@type': 'Organization', name: 'LS2N', url: 'https://www.ls2n.fr'},
      ],
      knowsAbout: [
        'Cloud computing',
        'Kubernetes',
        'Energy-aware computing',
        'Power capping',
        'Intel RAPL',
        'Distributed systems',
        'Green IT',
      ],
      sameAs: [
        'https://github.com/menraromial',
        'https://www.linkedin.com/in/menraromial',
        'https://x.com/mwrdev_',
        'https://medium.com/@menraromial',
        'https://scholar.google.com/citations?user=M2nDshIAAAAJ',
        'https://www.researchgate.net/profile/Romial-Menra',
        'https://orcid.org/0009-0007-0943-8593',
        'https://hal.science/hal-05638939',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Menra Romial',
      publisher: {'@id': `${SITE}/#person`},
    },
  ],
};

const config: Config = {
  title: 'Menra Romial',
  tagline: 'PhD candidate in computer science, energy-aware cloud computing',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: SITE,
  baseUrl: '/',
  trailingSlash: true,
  organizationName: 'menraromial',
  projectName: 'menraromial.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    // Blog posts are plain Markdown, not MDX: keeps {, < and HTML in tutorials intact.
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap',
  ],

  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'}},
    {tagName: 'script', attributes: {type: 'application/ld+json'}, innerHTML: JSON.stringify(person)},
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          blogTitle: 'Blog',
          blogDescription:
            'Technical articles by Menra Romial on Kubernetes, Linux power management and cloud infrastructure.',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          postsPerPage: 10,
          showReadingTime: true,
          onInlineAuthors: 'throw',
          onUntruncatedBlogPosts: 'ignore',
          feedOptions: {
            type: ['rss', 'atom'],
            title: 'Menra Romial',
            copyright: `© ${new Date().getFullYear()} Menra Romial`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'monthly',
          // Keep thin listing pages out of the sitemap.
          ignorePatterns: ['/blog/tags/**', '/blog/archive/**', '/blog/authors/**'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [['@docusaurus/plugin-client-redirects', {redirects: legacyRedirects}]],

  themeConfig: {
    image: 'og-image.png',
    metadata: [
      {
        name: 'keywords',
        content:
          'Menra Romial, Romial Menra, Menra Wedwang Romial, energy-aware computing, power capping, Intel RAPL, Kubernetes, cloud computing, green IT, IMT Atlantique, Inria, LS2N',
      },
      {name: 'author', content: 'Menra Romial'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@mwrdev_'},
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Menra Romial',
      items: [
        {to: '/publications', label: 'Publications', position: 'right'},
        {to: '/talks', label: 'Talks', position: 'right'},
        {to: '/teaching', label: 'Teaching', position: 'right'},
        {to: '/projects', label: 'Projects', position: 'right'},
        {to: '/blog', label: 'Blog', position: 'right'},
        {to: '/cv', label: 'CV', position: 'right', className: 'nav-cta'},
      ],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    prism: {
      // Same code styling as the course site (menraromial.com/ingenierie-deploiement).
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'yaml', 'go', 'docker', 'hcl', 'groovy', 'ini', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
