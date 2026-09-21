import type {ReactNode} from 'react';
import styles from './PageHeader.module.css';

// Tinted band used at the top of every inner page, matching the home hero.
export default function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}): ReactNode {
  return (
    <header className={styles.band}>
      <div className={styles.inner}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        {children && <div className={styles.intro}>{children}</div>}
      </div>
    </header>
  );
}
