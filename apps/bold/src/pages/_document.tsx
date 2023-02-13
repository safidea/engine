import { Html, Head, Main, NextScript } from 'next/document'
import { app } from '../config'
import { getPage } from '../utils'

import type { App } from 'bold-config'

const { defaultLocale } = app as App

export default function Document({
  __NEXT_DATA__,
  dangerousAsPath,
}: {
  __NEXT_DATA__: { locale: string }
  dangerousAsPath: string
}) {
  const path = dangerousAsPath.replace(/^\//, '')
  const container =
    path && path.search('_next') === -1 ? getPage(path)?.container : { html: '', body: '' }
  const currentLocale = __NEXT_DATA__.locale ?? defaultLocale
  return (
    <Html lang={currentLocale} className={container?.html ?? ''}>
      <Head />
      <body className={container?.body ?? ''}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
