import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import type {Props} from '@theme/BlogLayout';
import PageHeader from '@site/src/components/PageHeader';

// Index-like blog routes: post list, pagination, tags, archive, authors.
const INDEX_ROUTE = /^\/blog\/(page\/\d+\/?)?$|^\/blog\/(tags|archive|authors)(\/|$)/;

// Blog layout. Index pages get the same header band as the other pages and a
// single list column; post pages show the "All posts" sidebar and a wide
// reading column, without a table of contents.
export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc: _toc, children, ...layoutProps} = props;
  const {pathname} = useLocation();
  const isIndex = INDEX_ROUTE.test(pathname);

  return (
    <Layout {...layoutProps}>
      {isIndex && (
        <PageHeader kicker="Writing" title="Blog">
          <p>
            Technical notes and tutorials on Kubernetes, Linux power management and cloud
            infrastructure, written along the way of my research.
          </p>
        </PageHeader>
      )}
      <div className="container margin-vert--lg">
        <div className="row">
          {!isIndex && <BlogSidebar sidebar={sidebar} />}
          <main className={isIndex ? 'col col--9 blog-index' : 'col col--9 blog-post'}>{children}</main>
        </div>
      </div>
    </Layout>
  );
}
