import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import {Icon} from '@site/src/components/Icons';
import styles from '@site/src/css/pages.module.css';

type Entry = {when: string; title: string; where: string; points?: string[]; note?: string};

const education: Entry[] = [
  {
    when: '2024 to present',
    title: 'PhD in Computer Science',
    where: 'IMT Atlantique, Inria, LS2N, Nantes, France',
    note: 'Thesis: Contribution à la gestion de la puissance dans les infrastructures cloud : de la limitation matérielle à l’orchestration adaptative.',
  },
  {
    when: '2021 to 2024',
    title: 'Master of Engineering in Computer Science',
    where: 'National Advanced School of Engineering of Yaoundé (ENSPY), Cameroon',
    note: 'Specialisation in distributed systems and software engineering.',
  },
  {
    when: '2019 to 2021',
    title: 'Preparatory classes, mathematics and physics',
    where: 'ENSPY, Cameroon',
  },
];

const experience: Entry[] = [
  {
    when: 'Nov 2024 to present',
    title: 'PhD candidate',
    where: 'Inria, IMT Atlantique, LS2N, Nantes',
    points: [
      'Characterised the interaction between Intel RAPL power limits and Turbo Boost on four Intel Xeon microarchitectures, and derived an analytical model of turbo duration.',
      'Showed that power capping below about 50% of TDP systematically degrades energy efficiency.',
      'Designing Kubernetes components for power-aware operation: node-level capping, automatic power profiling and energy-aware scheduling.',
      "Large-scale experimentation on Grid'5000; collaboration with Orange Research.",
    ],
  },
  {
    when: 'Apr 2024 to Aug 2024',
    title: 'Research intern',
    where: 'IMT Atlantique, Nantes',
    points: [
      "Implemented server power limitation with Intel RAPL and evaluated it on Grid'5000.",
      'Developed an energy-aware Kubernetes scheduler with custom resource constraints; results published at COMPAS 2024.',
    ],
  },
  {
    when: 'May 2022 to Mar 2024',
    title: 'Software developer and team lead',
    where: 'Forall Founders, Cameroon',
    points: [
      'Led a team of 10 developers building e-learning platforms and school management systems.',
      'Project manager of a mobile e-learning application with 15,000+ active users; cut latency from 5 s to 1.2 s.',
      'Built an IoT attendance system (PyQt, Raspberry Pi, Arduino) and CI/CD pipelines.',
    ],
  },
];

const skills: [string, string][] = [
  ['Research & HPC', "Grid'5000, Intel RAPL, powercap, energy profiling, performance benchmarking"],
  ['Cloud & DevOps', 'Kubernetes (k8s, k3s, kubeadm, Kubebuilder, scheduler plugins), Docker, Terraform, Ansible, GitHub Actions, GitLab CI, Prometheus, Grafana'],
  ['Languages', 'Go, Python, C, Java, JavaScript/TypeScript, Bash'],
  ['Web', 'Django, FastAPI, Node.js, React, Next.js, Vue.js, Spring Boot'],
  ['Data', 'PostgreSQL, MySQL, MongoDB, Redis, Pandas, NumPy'],
  ['Spoken', 'French, English'],
];

function Rows({items}: {items: Entry[]}) {
  return (
    <>
      {items.map((e) => (
        <div key={e.title} className={styles.entry}>
          <div className={styles.entryWhen}>{e.when}</div>
          <div>
            <h3 className={styles.entryTitle}>{e.title}</h3>
            <p className={styles.entryWhere}>{e.where}</p>
            {e.note && <p>{e.note}</p>}
            {e.points && (
              <ul className={styles.list}>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default function CV(): ReactNode {
  return (
    <Layout
      title="CV"
      description="Curriculum vitae of Menra Romial (Menra Wedwang Romial), PhD candidate in energy-aware cloud computing at IMT Atlantique, Inria and LS2N.">
      <PageHeader kicker="Curriculum vitae" title="Menra Wedwang Romial">
        <p>
          PhD candidate working on power management in cloud infrastructures, from hardware power
          limiting to energy-aware orchestration in Kubernetes. Published as Romial Menra.
        </p>
        <Link className={styles.button} href="pathname:///pdf/resume_romial.pdf">
          <Icon name="cv" size={18} /> Download the full CV (PDF)
        </Link>
      </PageHeader>

      <main className={styles.container}>
        <section className={styles.section}>
          <p className={styles.kicker}>Education</p>
          <h2 className={styles.sectionTitle}>Education</h2>
          <Rows items={education} />
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>Experience</p>
          <h2 className={styles.sectionTitle}>Research and professional experience</h2>
          <Rows items={experience} />
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>Academic activities</p>
          <h2 className={styles.sectionTitle}>Publications, talks and teaching</h2>
          <p>
            See the <Link to="/publications">publications</Link>, <Link to="/talks">talks</Link> and{' '}
            <Link to="/teaching">teaching</Link> pages for the complete lists.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>Skills</p>
          <h2 className={styles.sectionTitle}>Technical skills</h2>
          <dl className={styles.skills}>
            {skills.map(([k, v]) => (
              <div key={k} style={{display: 'contents'}}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </Layout>
  );
}
