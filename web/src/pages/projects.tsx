import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {projects, type Project} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Projects(): ReactNode {
  const groups: Project['group'][] = ['Research', 'Community'];
  return (
    <Layout
      title="Projects"
      description="Research and community projects by Menra Romial: RAPL power capping and energy-aware scheduling in Kubernetes, and open science in Cameroon.">
      <PageHeader kicker="What I build" title="Projects">
        <p>
          Research software that makes power a first-class resource in Kubernetes, and community
          initiatives around research and technology in Cameroon.
        </p>
      </PageHeader>

      <main className={styles.container}>
        {groups.map((g) => (
          <section key={g} className={styles.section}>
            <p className={styles.kicker}>{g === 'Research' ? 'Research software' : 'Community'}</p>
            <h2 className={styles.sectionTitle}>
              {g === 'Research' ? 'Research projects' : 'Community initiatives'}
            </h2>
            {projects
              .filter((p) => p.group === g)
              .map((p) => (
                <article key={p.name} className={styles.entry}>
                  <div className={styles.entryWhen}>{p.status}</div>
                  <div>
                    <h3 className={styles.entryTitle}>{p.name}</h3>
                    <p>{p.text}</p>
                    <div className={styles.tags}>
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
          </section>
        ))}
      </main>
    </Layout>
  );
}
