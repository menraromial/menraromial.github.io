import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import PublicationEntry from '@site/src/components/PublicationEntry';
import {Icon} from '@site/src/components/Icons';
import {profiles, publications} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Publications(): ReactNode {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  const academic = profiles.filter((p) => ['scholar', 'orcid', 'researchgate'].includes(p.icon));

  return (
    <Layout
      title="Publications"
      description="Peer-reviewed publications of Menra Romial (Romial Menra): Euro-Par 2026 on Intel RAPL and Turbo Boost, COMPAS 2024 on energy-aware Kubernetes.">
      <PageHeader kicker="Research output" title="Publications">
        <p>
          Peer-reviewed papers on power management in cloud infrastructures, from hardware power
          limiting to energy-aware orchestration. Preprints are openly available on HAL.
        </p>
        <div className={styles.profileStrip}>
          {academic.map((p) => (
            <Link key={p.label} className={styles.chip} href={p.href}>
              <Icon name={p.icon} size={16} />
              {p.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <main className={styles.container}>
        {years.map((year) => (
          <section key={year}>
            <h2 className={styles.year}>{year}</h2>
            {publications
              .filter((p) => p.year === year)
              .map((p) => (
                <PublicationEntry key={p.id} pub={p} />
              ))}
          </section>
        ))}
      </main>
    </Layout>
  );
}
