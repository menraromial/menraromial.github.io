import type {ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import type {Props} from '@theme/BlogLayout';
import PageHeader from '@site/src/components/PageHeader';

// Blog layout without the "All posts" sidebar. Index and tag pages (no table of
// contents) get the same header band as the other pages; posts keep a wide
// reading column next to their table of contents.
export default function BlogLayout(props: Props): ReactNode {
  const {toc, children, ...layoutProps} = props;
  delete (layoutProps as {sidebar?: unknown}).sidebar;
  const isPost = Boolean(toc);

  return (
    <Layout {...layoutProps}>
      {!isPost && (
        <PageHeader kicker="Writing" title="Blog">
          <p>
            Technical notes and tutorials on Kubernetes, Linux power management and cloud
            infrastructure, written along the way of my research.
          </p>
        </PageHeader>
      )}
      <div className="container margin-vert--lg">
        <div className="row">
          <main className={clsx('col', isPost ? 'col--9' : 'col--9 blog-index')}>{children}</main>
          {toc && <div className="col col--3">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
