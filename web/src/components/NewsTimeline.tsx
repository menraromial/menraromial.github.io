import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {NewsItem} from '@site/src/data/site';
import styles from './NewsTimeline.module.css';

export default function NewsTimeline({items}: {items: NewsItem[]}): ReactNode {
  return (
    <ol className={styles.timeline}>
      {items.map((n) => (
        <li key={n.text}>
          <div className={styles.timelineMeta}>
            <time>{n.date}</time>
            <span className={`${styles.tag} ${styles[`tag${n.kind}`]}`}>{n.kind}</span>
          </div>
          <p>{n.href ? <Link to={n.href}>{n.text}</Link> : n.text}</p>
        </li>
      ))}
    </ol>
  );
}
