import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {profiles} from '@site/src/data/site';
import {Icon} from '@site/src/components/Icons';
import styles from './styles.module.css';

export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.name}>Menra Romial</p>
          <p className={styles.tagline}>
            PhD candidate working on power management and energy-aware cloud computing.
          </p>
        </div>

        <div>
          <p className={styles.heading}>Contact</p>
          <address className={styles.address}>
            IMT Atlantique, LS2N
            <br />
            4 Rue Alfred Kastler
            <br />
            44300 Nantes, France
          </address>
          <Link href="mailto:itsme@menraromial.com">itsme@menraromial.com</Link>
        </div>

        <div>
          <p className={styles.heading}>Elsewhere</p>
          <ul className={styles.links}>
            {profiles
              .filter((p) => p.icon !== 'mail')
              .map((p) => (
                <li key={p.label}>
                  <Link href={p.href}>
                    <Icon name={p.icon} size={15} />
                    {p.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Menra Romial</span>
        <span>Also published as Romial Menra</span>
      </div>
    </footer>
  );
}
