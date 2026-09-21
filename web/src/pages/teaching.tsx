import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {courses, supervision} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Teaching(): ReactNode {
  return (
    <Layout
      title="Teaching"
      description="Teaching and supervision by Menra Romial at IMT Atlantique: databases, cloud computing with VMware vSphere, and M2 research internships.">
      <PageHeader kicker="Teaching & mentoring" title="Teaching">
        <p>
          Tutorials and lab sessions at IMT Atlantique, and supervision of research interns working
          on energy-aware systems.
        </p>
      </PageHeader>

      <main className={styles.container}>
        <section className={styles.section}>
          <p className={styles.kicker}>Courses</p>
          <h2 className={styles.sectionTitle}>IMT Atlantique</h2>
          <div className={styles.grid2}>
            {courses.map((c) => (
              <article key={c.title} className={styles.card}>
                <div className={styles.badges}>
                  <span className={styles.badge}>{c.period}</span>
                  <span className={styles.meta}>{c.role}</span>
                </div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                {c.titleFr && <p className={styles.meta}>{c.titleFr}</p>}
                <p className={styles.meta}>{c.place}</p>
                <p>{c.summary}</p>
                {c.audience && <p className={styles.muted}>{c.audience}</p>}
                <ul className={styles.list}>
                  {c.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>Mentoring</p>
          <h2 className={styles.sectionTitle}>Student supervision</h2>
          <div className={styles.stack}>
            {supervision.map((s) => (
              <article key={s.name} className={styles.card}>
                <div className={styles.badges}>
                  <span className={styles.badge}>{s.level}</span>
                  <span className={styles.meta}>{s.period}</span>
                </div>
                <h3 className={styles.cardTitle}>{s.name}</h3>
                <p>
                  <em>{s.topic}</em>
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
