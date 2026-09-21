import type {ReactNode} from 'react';
import clsx from 'clsx';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/BlogPostItem/Content';

// In the blog list, show each post's description instead of its raw excerpt,
// so that posts starting with headings or lists still read as a clean summary.
export default function BlogPostItemContent({children, className}: Props): ReactNode {
  const {isBlogPostPage, metadata} = useBlogPost();

  if (!isBlogPostPage && metadata.description) {
    return (
      <div className={clsx('markdown', className)}>
        <p className="blog-summary">{metadata.description}</p>
      </div>
    );
  }

  return (
    <div id={isBlogPostPage ? blogPostContainerID : undefined} className={clsx('markdown', className)}>
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
