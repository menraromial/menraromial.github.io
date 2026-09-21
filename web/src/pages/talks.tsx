import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {talks} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Talks(): ReactNode {
  return (
    <Layout
      title="Talks"
      description="Talks and presentations by Menra Romial (Romial Menra): Euro-Par 2026 in Pisa, STACK team seminar, COMPAS 2024.">
      <PageHeader kicker="Presentations" title="Talks">
        <p>Conference talks and seminars on power capping, Intel RAPL and energy-aware Kubernetes.</p>
      </PageHeader>

      <main className={styles.container}>
        <section className={styles.section}>
          {talks.map((t) => (
            <article key={t.title} className={styles.talkRow}>
              <div>
                <div className={styles.talkDate}>{t.date}</div>
                <div className={styles.talkPlace}>{t.place}</div>
              </div>
              <div>
                <div className={styles.badges}>
                  <span className={styles.badge}>{t.event}</span>
                  {t.award && <span className={styles.badgeOutline}>{t.award}</span>}
                  <span className={styles.meta}>{t.kind}</span>
                </div>
                <h2 className={styles.cardTitle}>{t.title}</h2>
                {t.eventLong && <p className={styles.meta}>{t.eventLong}</p>}
                <p>{t.abstract}</p>
                {t.points && (
                  <ul className={styles.list}>
                    {t.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                {t.links && (
                  <div className={styles.links}>
                    {t.links.map((l) => (
                      <Link key={l.label} href={l.href}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
