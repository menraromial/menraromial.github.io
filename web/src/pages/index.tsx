import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {Icon} from '@site/src/components/Icons';
import NewsTimeline from '@site/src/components/NewsTimeline';
import PublicationEntry, {pubStyles} from '@site/src/components/PublicationEntry';
import {news, profiles, publications, talks, themes} from '@site/src/data/site';
import styles from './index.module.css';

function ClusterIllustration() {
  // Three nodes with power gauges: orchestration under a power budget.
  const nodes = [
    {x: 20, load: 0.8},
    {x: 120, load: 0.45},
    {x: 220, load: 0.62},
  ];
  return (
    <svg viewBox="0 0 320 200" className={styles.illustration} role="img" aria-label="Three Kubernetes nodes, each with its own power budget">
      <rect x="0" y="0" width="320" height="200" rx="10" className={styles.illuBg} />
      <text x="20" y="32" className={styles.illuLabel}>cluster power budget</text>
      <line x1="20" y1="44" x2="300" y2="44" className={styles.illuBudget} />
      {nodes.map((n) => (
        <g key={n.x} transform={`translate(${n.x},60)`}>
          <rect width="80" height="112" rx="8" className={styles.illuNode} />
          <rect x="14" y="14" width="52" height="10" rx="3" className={styles.illuPod} />
          <rect x="14" y="30" width="52" height="10" rx="3" className={styles.illuPod} />
          <rect x="14" y="94" width="52" height="8" rx="4" className={styles.illuGaugeBg} />
          <rect x="14" y="94" width={52 * n.load} height="8" rx="4" className={styles.illuGauge} />
          <text x="40" y="80" textAnchor="middle" className={styles.illuWatts}>
            {Math.round(n.load * 150)} W
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Home(): ReactNode {
  const featured = publications[0];
  return (
    <Layout
      title="Menra Romial, PhD candidate in energy-aware cloud computing"
      description="Menra Romial (Romial Menra), PhD candidate at IMT Atlantique, Inria and LS2N in Nantes, working on power management from Intel RAPL to energy-aware Kubernetes orchestration.">
      {/* ---------------- Hero ---------------- */}
      <header className={styles.heroBand}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>PhD Candidate · Computer Science</p>
            <h1 className={styles.name}>Menra Romial</h1>
            <p className={styles.lede}>
              I work on making cloud infrastructures consume less energy, without making them
              slower.
            </p>
            <div className={styles.bio}>
              <p>
                I am a PhD candidate at <strong>IMT Atlantique</strong> and <strong>Inria</strong>,
                in the STACK team of the <strong>LS2N</strong> laboratory in Nantes, France. My
                thesis looks at power management across the whole cloud stack: from the hardware
                mechanisms that let a processor limit its own power, up to the orchestration layer
                where Kubernetes decides where and how workloads run.
              </p>
              <p>
                At the hardware level, I study how Intel RAPL and Turbo Boost really interact on
                production servers, and build models that predict their behaviour. At the
                orchestration level, I design Kubernetes components that treat power as a
                first-class resource. This work relies on large-scale experiments on the Grid'5000
                testbed and is carried out partly with Orange Research.
              </p>
              <p>
                Before the PhD, I trained as a computer engineer at ENSPY in Yaoundé, Cameroon, and
                spent two years building and running production platforms as a developer and team
                lead. I am also involved in C5IN, a research and innovation network on cloud, edge
                and IoT in Cameroon.
              </p>
            </div>
            <div className={styles.ctas}>
              <Link className={styles.btnPrimary} to="/publications">
                Read my research
              </Link>
              <Link className={styles.btnGhost} href="pathname:///pdf/resume_romial.pdf">
                <Icon name="cv" size={17} /> Download CV
              </Link>
            </div>
            <ul className={styles.profiles}>
              {profiles.map((p) => (
                <li key={p.label}>
                  <Link href={p.href} title={p.label} aria-label={p.label}>
                    <Icon name={p.icon} size={19} />
                    <span>{p.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.side}>
            <div className={styles.portrait}>
              <img src="/img/profile.jpg" alt="Portrait of Menra Romial" width={640} height={800} />
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Based in</dt>
                <dd>Nantes, France</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>STACK, LS2N</dd>
              </div>
              <div>
                <dt>PhD</dt>
                <dd>2024 to 2027</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>French, English</dd>
              </div>
              <div>
                <dt>Also published as</dt>
                <dd>Romial Menra</dd>
              </div>
            </dl>
            <p className={styles.open}>Open to collaborations on energy-aware systems.</p>
          </aside>
        </div>

        <div className={styles.affiliations}>
          <span className={styles.affLabel}>Affiliations</span>
          <img src="/img/logos/IMTA.png" alt="IMT Atlantique" />
          <img src="/img/logos/inria.png" alt="Inria" />
          <img src="/img/logos/LogoLS2N.png" alt="LS2N" />
        </div>
      </header>

      <main>
        {/* ---------------- Featured ---------------- */}
        <section className={styles.section}>
          <p className={styles.kicker}>Featured work</p>
          <div className={styles.featured}>
            <figure className={styles.featuredFigure}>
              <img src="/img/research/energy-efficiency.png" alt="Slowdown and energy ratio as the power cap decreases" />
              <figcaption>
                Below about 50% of TDP, the slowdown outweighs the power saved and the energy
                ratio climbs above 1.
              </figcaption>
            </figure>
            <div className={styles.featuredBody}>
              <div>
                <div className={pubStyles.pubMeta}>
                  <span className={pubStyles.venueBadge}>Euro-Par 2026</span>
                  <span className={pubStyles.awardBadge}>Best Paper Award nominee</span>
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredIntro}>
                  Power capping is the standard way to keep servers within an electrical budget.
                  We measured how Intel's RAPL limits and Turbo Boost actually behave together on
                  four generations of Xeon processors, and what that means for energy.
                </p>
                <div className={pubStyles.pubLinks}>
                  {featured.links.map((l) => (
                    <Link key={l.label} href={l.href}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
              <ol className={styles.findings}>
                <li>
                  <strong>Few knobs matter.</strong> Turbo behaviour is driven by the long-term
                  window and the two power limits; the short-term window is negligible.
                </li>
                <li>
                  <strong>Turbo is predictable.</strong> A closed-form model gives how long a
                  processor holds its boost, matching measurements almost exactly.
                </li>
                <li>
                  <strong>There is a floor.</strong> Capping below half of TDP systematically
                  costs energy instead of saving it.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------- Research themes ---------------- */}
        <section className={styles.section}>
          <p className={styles.kicker}>Research</p>
          <h2 className={styles.sectionTitle}>From the processor to the cluster</h2>
          <div className={styles.themes}>
            {themes.map((t, i) => (
              <article key={t.title} className={styles.theme}>
                <div className={styles.themeMedia}>
                  {t.image ? <img src={t.image} alt="" loading="lazy" /> : <ClusterIllustration />}
                </div>
                <span className={styles.themeIndex}>0{i + 1}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- News ---------------- */}
        <section className={`${styles.section} ${styles.newsSection}`}>
          <div className={styles.newsHead}>
            <p className={styles.kicker}>News</p>
            <h2 className={styles.sectionTitle}>Latest</h2>
            <Link className={styles.more} to="/news">
              All news →
            </Link>
          </div>
          <NewsTimeline items={news} />
        </section>

        {/* ---------------- Publications ---------------- */}
        <section className={styles.section}>
          <p className={styles.kicker}>Publications</p>
          <h2 className={styles.sectionTitle}>Peer-reviewed papers</h2>
          {publications.map((p) => (
            <PublicationEntry key={p.id} pub={p} />
          ))}
          <Link className={styles.more} to="/publications">
            All publications →
          </Link>
        </section>

        {/* ---------------- Talks ---------------- */}
        <section className={styles.section}>
          <p className={styles.kicker}>Talks</p>
          <h2 className={styles.sectionTitle}>Recent presentations</h2>
          <div className={styles.talks}>
            {talks.map((t) => (
              <article key={t.title} className={styles.talk}>
                <p className={styles.talkDate}>{t.date}</p>
                <h3>{t.title}</h3>
                <p className={styles.talkEvent}>
                  {t.event} · {t.place}
                </p>
                {t.links?.[0] && (
                  <Link className={styles.talkLink} href={t.links[0].href}>
                    {t.links[0].label} →
                  </Link>
                )}
              </article>
            ))}
          </div>
          <Link className={styles.more} to="/talks">
            All talks →
          </Link>
        </section>
      </main>
    </Layout>
  );
}
