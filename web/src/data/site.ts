// Single source of truth for the site's academic content.
// The home page shows a subset; the full pages will read the same data.

export const ME = 'Romial Menra';

export type Profile = {
  label: string;
  href: string;
  icon: 'mail' | 'cv' | 'scholar' | 'orcid' | 'researchgate' | 'github' | 'linkedin';
};

export const profiles: Profile[] = [
  {label: 'Email', href: 'mailto:itsme@menraromial.com', icon: 'mail'},
  {label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=M2nDshIAAAAJ', icon: 'scholar'},
  {label: 'ORCID', href: 'https://orcid.org/0009-0007-0943-8593', icon: 'orcid'},
  {label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Romial-Menra', icon: 'researchgate'},
  {label: 'GitHub', href: 'https://github.com/menraromial', icon: 'github'},
  {label: 'LinkedIn', href: 'https://www.linkedin.com/in/menraromial', icon: 'linkedin'},
];

export type NewsItem = {
  date: string;
  kind: 'Talk' | 'Award' | 'Paper' | 'Team' | 'Service';
  text: string;
  href?: string;
};

export const news: NewsItem[] = [
  {
    date: 'Aug 2026',
    kind: 'Talk',
    text: 'Presented our work on Intel RAPL and Turbo Boost at Euro-Par 2026 in Pisa, Italy.',
    href: '/talks',
  },
  {
    date: 'Jun 2026',
    kind: 'Award',
    text: 'Our Euro-Par 2026 paper was nominated for the Best Paper Award.',
  },
  {
    date: 'Apr 2026',
    kind: 'Paper',
    text: 'Paper accepted at Euro-Par 2026, the 32nd International European Conference on Parallel and Distributed Computing (acceptance rate 26.2%).',
  },
  {
    date: 'Apr 2026',
    kind: 'Team',
    text: 'Welcoming Clement Obama as M2 research intern, working on reactive control of energy constraints in Kubernetes clusters.',
  },
  {
    date: 'Dec 2025',
    kind: 'Service',
    text: 'Student volunteer at UCC and BDCAT 2025 in Nantes.',
    href: '/blog/volunteering-ucc-bdcat-2025',
  },
];

export type Publication = {
  id: string;
  venue: string;
  venueLong: string;
  year: number;
  title: string;
  authors: string[];
  award?: string;
  takeaway: string;
  image?: string;
  links: {label: string; href: string}[];
  bibtex: string;
};

export const publications: Publication[] = [
  {
    id: 'menra2026europar',
    venue: 'Euro-Par',
    venueLong: 'Euro-Par 2026: Parallel Processing, Lecture Notes in Computer Science, Springer, pp. 135-149',
    year: 2026,
    title:
      'Understanding Power Limiting Mechanisms in Modern Processors: A Deep Dive Into Intel RAPL and Turbo Boost Dynamics',
    authors: [ME, 'Guillaume Rosinosky', 'Remous-Aris Koutsiamanis', 'Sébastien Bolle', 'Jean-Marc Menaud'],
    award: 'Best Paper Award nominee',
    takeaway:
      'Only the long-term window and the two power limits drive turbo behaviour; a closed-form model predicts turbo duration on four Intel Xeon generations; capping below half of TDP wastes energy instead of saving it.',
    image: '/img/research/tmax-validation.png',
    links: [
      {label: 'PDF', href: 'https://hal.science/hal-05729597'},
      {label: 'DOI', href: 'https://doi.org/10.1007/978-3-032-35251-4_10'},
      {label: 'Slides', href: 'pathname:///pdf/talk/RAPL-power-capping-and-turbo-boost.pdf'},
    ],
    bibtex: `@inproceedings{menra2026europar,
  title     = {Understanding Power Limiting Mechanisms in Modern Processors:
               A Deep Dive Into Intel RAPL and Turbo Boost Dynamics},
  author    = {Menra, Romial and Rosinosky, Guillaume and Koutsiamanis, Remous-Aris
               and Bolle, S{\\'e}bastien and Menaud, Jean-Marc},
  booktitle = {Euro-Par 2026: Parallel Processing},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer},
  pages     = {135--149},
  year      = {2026},
  doi       = {10.1007/978-3-032-35251-4_10}
}`,
  },
  {
    id: 'menra2024compas',
    venue: 'COMPAS',
    venueLong: 'COMPAS 2024, Conférence francophone en Parallélisme, Architecture et Système, Nantes, France',
    year: 2024,
    title: "Intégration de l'Aspect Énergétique dans Kubernetes",
    authors: [ME, 'Remous-Aris Koutsiamanis', 'Jean-Marc Menaud'],
    takeaway:
      'Brings the server’s real power draw, measured through RAPL, into Kubernetes scheduling decisions, so that containers are placed according to actual energy use rather than requested resources.',
    links: [{label: 'PDF', href: 'https://hal.science/hal-05638939'}],
    bibtex: `@inproceedings{menra2024compas,
  title     = {Int{\\'e}gration de l'Aspect {\\'E}nerg{\\'e}tique dans Kubernetes},
  author    = {Menra, Romial and Koutsiamanis, Remous-Aris and Menaud, Jean-Marc},
  booktitle = {COMPAS 2024 - Conf{\\'e}rence francophone d'informatique en
               Parall{\\'e}lisme, Architecture et Syst{\\\`e}me},
  address   = {Nantes, France},
  year      = {2024},
  url       = {https://hal.science/hal-05638939}
}`,
  },
];

export type Theme = {
  title: string;
  text: string;
  image?: string;
  illustration?: 'cluster';
};

export const themes: Theme[] = [
  {
    title: 'Hardware power limiting',
    text: 'How processors cap their own power. I study Intel RAPL domains, their power limits and time windows, and how they interact with Turbo Boost on real servers.',
    image: '/img/research/rapl-domains.png',
  },
  {
    title: 'Modelling power behaviour',
    text: 'Turning measurements into predictions: analytical models of how long a processor holds its boost, and where power capping stops paying off in energy.',
    image: '/img/research/long-term-window.png',
  },
  {
    title: 'Energy-aware orchestration',
    text: 'Making power a first-class resource in Kubernetes: node-level capping, automatic server profiling and scheduling that follows real energy use.',
    illustration: 'cluster',
  },
];

export type Talk = {
  date: string;
  event: string;
  eventLong?: string;
  place: string;
  title: string;
  kind: 'Conference' | 'Seminar';
  award?: string;
  abstract: string;
  points?: string[];
  links?: {label: string; href: string}[];
};

export const talks: Talk[] = [
  {
    date: 'Aug 2026',
    event: 'Euro-Par 2026',
    eventLong: '32nd International European Conference on Parallel and Distributed Computing',
    place: 'Pisa, Italy',
    title: 'Understanding Power Limiting Mechanisms in Modern Processors',
    kind: 'Conference',
    award: 'Best Paper Award nominee',
    abstract:
      'A deep dive into Intel RAPL and Turbo Boost, and how their interaction governs power capping on modern servers. Joint work with Guillaume Rosinosky, Remous-Aris Koutsiamanis, Sébastien Bolle (Orange Research) and Jean-Marc Menaud.',
    points: [
      'Turbo behaviour is driven by the long-term window and the two power limits; the short-term window is negligible.',
      'A closed-form model predicts the effective turbo duration on four Intel Xeon microarchitectures.',
      'Capping below 50% of TDP systematically destroys energy efficiency.',
    ],
    links: [
      {label: 'Slides', href: 'pathname:///pdf/talk/RAPL-power-capping-and-turbo-boost.pdf'},
      {label: 'Paper', href: 'https://doi.org/10.1007/978-3-032-35251-4_10'},
    ],
  },
  {
    date: 'Oct 2025',
    event: 'STACK team seminar',
    place: 'Arzon, France',
    title: 'Energy-Aware Kubernetes Orchestration for Grid-Responsive Computing',
    kind: 'Seminar',
    abstract:
      'Adapting Kubernetes workloads to electricity grid fluctuations through constraint-based scheduling and dynamic scaling, to cope with electricity price volatility and grid stability in cloud environments.',
    links: [
      {label: 'Related: custom scheduler', href: '/blog/guide-building-custom-kubernetes-scheduler'},
      {label: 'Related: Kubebuilder controller', href: '/blog/building-a-kubernetes-controller-with-kubebuilder-from-scratch'},
    ],
  },
  {
    date: 'Jul 2024',
    event: 'COMPAS 2024',
    eventLong: 'Conférence francophone d’informatique en Parallélisme, Architecture et Système',
    place: 'Nantes, France',
    title: "Intégration de l'Aspect Énergétique dans Kubernetes",
    kind: 'Conference',
    abstract:
      'Integrating energy consumption into Kubernetes orchestration, using RAPL measurements to make scheduling aware of the real power draw of servers.',
    points: [
      'Energy-aware scheduling strategies',
      'Monitoring and collecting energy metrics',
      'Custom Kubernetes schedulers for energy optimisation',
    ],
    links: [{label: 'Paper', href: 'https://hal.science/hal-05638939'}],
  },
];

export type Course = {
  title: string;
  titleFr?: string;
  role: string;
  period?: string;
  place?: string;
  audience?: string;
  summary: string;
  topics?: string[];
  url?: string;
};

export const courses: Course[] = [
  {
    title: 'Deployment and Production Engineering',
    titleFr: 'Ingénierie du Déploiement et de la Mise en Production',
    role: 'Course designer and lead',
    audience: 'Engineering cycle, M1 and M2',
    summary:
      'A three-semester course that retraces the history of deployment, from the hand-configured server to MLOps pipelines.',
    url: 'https://menraromial.com/ingenierie-deploiement/',
  },
  {
    title: 'Databases',
    titleFr: 'Bases de données',
    role: 'Teaching assistant (TD/TP)',
    period: 'Spring 2025',
    place: 'IMT Atlantique, Nantes',
    audience: 'First-year engineering students (FISE 1A, semester S6)',
    summary:
      'Tutorials and lab sessions on relational databases, from the relational model to programmatic access.',
    topics: [
      'Relational model and integrity constraints',
      'SQL queries, transactions and access rights',
      'Normalisation theory: functional dependencies, normal forms',
      'Conceptual modelling with UML',
      'Programmatic interfaces for data persistence',
    ],
  },
  {
    title: 'Cloud Computing with VMware vSphere',
    role: 'Teaching assistant (TP)',
    period: 'Spring 2025',
    place: 'IMT Atlantique, Nantes',
    summary: 'Hands-on lab sessions on enterprise virtualisation with VMware vSphere and vCenter.',
    topics: [
      'Virtual machine provisioning and management',
      'vSphere and vCenter administration',
      'Resource allocation and monitoring',
      'Cloud infrastructure deployment',
    ],
  },
];

export type Supervision = {
  name: string;
  level: string;
  period: string;
  topic: string;
};

export const supervision: Supervision[] = [
  {
    name: 'Clement Obama',
    level: 'M2 research intern',
    period: 'Apr 2026 to Sep 2026',
    topic:
      'Reactive control of energy constraints in Kubernetes clusters: multi-lever re-adaptation policy with SLA management.',
  },
];

export type Project = {
  name: string;
  group: 'Research' | 'Community';
  status: string;
  text: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    name: 'PhD thesis',
    group: 'Research',
    status: '2024 to 2027',
    text: 'Contribution à la gestion de la puissance dans les infrastructures cloud : de la limitation matérielle à l’orchestration adaptative. Power management from hardware limiting to adaptive orchestration.',
    tags: ['Kubernetes', 'RAPL', "Grid'5000", 'Power management'],
  },
  {
    name: 'Powercap',
    group: 'Research',
    status: 'Ongoing',
    text: 'A power-capping tool built on Intel RAPL that plugs into Kubernetes as a DaemonSet. It enforces per-node power budgets at the package and DRAM level, with audit logs and a dry-run mode.',
    tags: ['Go', 'Kubernetes', 'RAPL', 'Linux'],
  },
  {
    name: 'Bridle',
    group: 'Research',
    status: 'Ongoing',
    text: 'A Kubernetes operator for automatic server power profiling. It observes workloads and builds per-node energy models that feed scheduling and capping decisions, without manual characterisation.',
    tags: ['Go', 'Kubernetes', 'Operator', 'Profiling'],
  },
  {
    name: 'Volta',
    group: 'Research',
    status: 'Ongoing',
    text: 'A Kubernetes scheduler plugin that treats energy as a first-class constraint alongside CPU and memory, routing pods to nodes with the lowest marginal energy cost without violating SLAs.',
    tags: ['Go', 'Kubernetes', 'Scheduler', 'Energy'],
  },
  {
    name: 'C5IN',
    group: 'Community',
    status: 'Ongoing',
    text: 'The Cameroon Cloud-Edge-IoT Innovation Network, a research and innovation network on cloud, edge computing and IoT, bridging academia, industry and government.',
    tags: ['Cloud', 'Edge', 'IoT', 'Cameroon'],
  },
  {
    name: 'DIBAC',
    group: 'Community',
    status: 'Ongoing',
    text: 'Dépôt Institutionnel et Bibliothèque Académique du Cameroun: an open-access repository that makes Cameroonian research visible and citable internationally.',
    tags: ['Open access', 'Cameroon'],
  },
  {
    name: 'TupuriHub',
    group: 'Community',
    status: 'Ongoing',
    text: 'A digital hub for Toupouri culture, language and heritage, gathering resources, events and community voices across borders.',
    tags: ['Culture', 'Heritage'],
  },
];
