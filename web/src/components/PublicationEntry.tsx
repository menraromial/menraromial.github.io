import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {ME, type Publication} from '@site/src/data/site';
import styles from './PublicationEntry.module.css';

export {styles as pubStyles};

export function Authors({names}: {names: string[]}): ReactNode {
  return (
    <>
      {names.map((n, i) => (
        <span key={n}>
          {n === ME ? <strong className={styles.me}>{n}</strong> : n}
          {i < names.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  );
}

export default function PublicationEntry({pub}: {pub: Publication}): ReactNode {
  const [showBib, setShowBib] = useState(false);
  return (
    <article className={styles.pub} id={pub.id}>
      <div className={styles.pubThumb}>
        {pub.image ? (
          <img src={pub.image} alt={`Figure from ${pub.title}`} loading="lazy" />
        ) : (
          <div className={styles.pubPlaceholder}>
            <span>{pub.venue}</span>
            <span>{pub.year}</span>
          </div>
        )}
      </div>
      <div>
        <div className={styles.pubMeta}>
          <span className={styles.venueBadge}>
            {pub.venue} {pub.year}
          </span>
          {pub.award && <span className={styles.awardBadge}>{pub.award}</span>}
        </div>
        <h3 className={styles.pubTitle}>{pub.title}</h3>
        <p className={styles.pubAuthors}>
          <Authors names={pub.authors} />
        </p>
        <p className={styles.pubVenue}>{pub.venueLong}</p>
        <p className={styles.pubTakeaway}>
          <span>Takeaway</span> {pub.takeaway}
        </p>
        <div className={styles.pubLinks}>
          {pub.links.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
          <button type="button" onClick={() => setShowBib((v) => !v)} aria-expanded={showBib}>
            BibTeX
          </button>
        </div>
        {showBib && <pre className={styles.bibtex}>{pub.bibtex}</pre>}
      </div>
    </article>
  );
}
