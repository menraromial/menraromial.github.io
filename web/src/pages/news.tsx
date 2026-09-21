import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import PageHeader from '@site/src/components/PageHeader';
import NewsTimeline from '@site/src/components/NewsTimeline';
import {news} from '@site/src/data/site';
import styles from '@site/src/css/pages.module.css';

export default function News(): ReactNode {
  return (
    <Layout
      title="News"
      description="News from Menra Romial: paper acceptances, awards, talks, supervision and community involvement.">
      <PageHeader kicker="Updates" title="News">
        <p>Papers, talks, awards and team news.</p>
      </PageHeader>
      <main className={styles.container}>
        <section className={styles.section}>
          <NewsTimeline items={news} />
        </section>
      </main>
    </Layout>
  );
}
