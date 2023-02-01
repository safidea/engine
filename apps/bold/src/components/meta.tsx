import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import type { Meta as MetaProps } from 'bold-page'

export default function Meta(props: MetaProps) {
  const router = useRouter()
  const { title, description, image, author, keywords, twitter, robots, domain } = props
  return (
    <Head>
      {/* General */}
      {title && <title>{title}</title>}
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="/favicon.ico" rel="shortcut icon" />
      {description && <meta content={description} name="description" key="description" />}
      {domain && <link rel="canonical" href={`${domain}${router.asPath}`} key="canonical" />}

      {/* Blog */}
      {author && <meta name="author" content={author} key="author" />}
      {keywords && <meta name="keywords" content={keywords} key="keywords" />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} key="og-title" />}
      {description && <meta property="og:description" content={description} key="og-description" />}
      {title && <meta property="og:site_name" content={title} key="og-site-name" />}
      <meta property="og:type" content="website" key="og-type" />
      {domain && <meta property="og:url" content={`${domain}${router.asPath}`} key="og-url" />}
      {domain && image && <meta property="og:image" content={`${domain}${image}`} key="og-image" />}

      {/* Twitter */}
      {title && <meta name="twitter:title" content={title} key="twitter-title" />}
      {description && (
        <meta name="twitter:description" content={description} key="twitter-description" />
      )}
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      {twitter && <meta name="twitter:site" content={twitter} key="twitter-site" />}
      {domain && image && (
        <meta name="twitter:image" content={`${domain}${image}`} key="twitter-image" />
      )}
    </Head>
  )
}
