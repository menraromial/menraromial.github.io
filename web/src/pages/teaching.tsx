import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {courses, supervision} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Teaching(): ReactNode {
  return (
    <Layout
      title="Teaching"
      description="Teaching by Menra Romial: the Deployment and Production Engineering course (Ingénierie du Déploiement), databases and cloud computing at IMT Atlantique, and M2 supervision.">
      <PageHeader kicker="Teaching & mentoring" title="Teaching">
        <p>
          Courses and lab sessions on deployment, cloud and databases, and supervision of research
          interns working on energy-aware systems.
        </p>
      </PageHeader>

      <main className={styles.container}>
        <section className={styles.section}>
          <p className={styles.kicker}>Courses</p>
          <h2 className={styles.sectionTitle}>What I teach</h2>
          {courses.map((c) => (
            <article key={c.title} className={styles.entry}>
              <div className={styles.entryWhen}>
                {c.period ?? 'Ongoing'}
                <span className={styles.entryRole}>{c.role}</span>
              </div>
              <div>
                <h3 className={styles.entryTitle}>{c.title}</h3>
                {c.titleFr && <p className={styles.entryWhere}>{c.titleFr}</p>}
                {(c.place || c.audience) && (
                  <p className={styles.meta}>{[c.place, c.audience].filter(Boolean).join(' · ')}</p>
                )}
                <p>{c.summary}</p>
                {c.topics && (
                  <div className={styles.tags}>
                    {c.topics.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
                {c.url && (
                  <div className={styles.links}>
                    <Link href={c.url}>Open the course →</Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>Mentoring</p>
          <h2 className={styles.sectionTitle}>Student supervision</h2>
          {supervision.map((s) => (
            <article key={s.name} className={styles.entry}>
              <div className={styles.entryWhen}>
                {s.period}
                <span className={styles.entryRole}>{s.level}</span>
              </div>
              <div>
                <h3 className={styles.entryTitle}>{s.name}</h3>
                <p>
                  <em>{s.topic}</em>
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
