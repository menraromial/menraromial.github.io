import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {courses, deploymentCourse as dc, supervision} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function Teaching(): ReactNode {
  return (
    <Layout
      title="Teaching"
      description="Teaching by Menra Romial: the Deployment and Production Engineering course (Ingénierie du Déploiement), databases and cloud computing at IMT Atlantique, and M2 supervision.">
      <PageHeader kicker="Teaching & mentoring" title="Teaching">
        <p>
          A full course on deployment engineering, tutorials and lab sessions at IMT Atlantique, and
          supervision of research interns working on energy-aware systems.
        </p>
      </PageHeader>

      <main className={styles.container}>
        <section className={styles.section}>
          <p className={styles.kicker}>Course I designed</p>
          <article className={styles.courseFeature}>
            <div className={styles.badges}>
              <span className={styles.badge}>{dc.role}</span>
              <span className={styles.meta}>
                {dc.audience} · taught in {dc.language}
              </span>
            </div>
            <h2 className={styles.courseTitle}>{dc.title}</h2>
            <p className={styles.courseSubtitle}>{dc.titleEn}</p>
            <p className={styles.courseSummary}>{dc.summary}</p>

            <div className={styles.semesters}>
              {dc.semesters.map((s) => (
                <div key={s.name} className={styles.semester}>
                  <p className={styles.kicker}>{s.name}</p>
                  <h3>{s.theme}</h3>
                  <p>{s.text}</p>
                  <ul className={styles.list}>
                    {s.topics.map((tp) => (
                      <li key={tp}>{tp}</li>
                    ))}
                  </ul>
                  <p className={styles.semesterStatus}>{s.status}</p>
                </div>
              ))}
            </div>

            <div className={styles.principles}>
              {dc.principles.map((pr, i) => (
                <div key={pr.title}>
                  <span className={styles.principleIndex}>0{i + 1}</span>
                  <h4>{pr.title}</h4>
                  <p>{pr.text}</p>
                </div>
              ))}
            </div>

            <div className={styles.courseFooter}>
              <Link className={styles.button} href={dc.url}>
                Open the course →
              </Link>
              <span className={styles.meta}>Content under {dc.license}</span>
            </div>
          </article>
        </section>

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
