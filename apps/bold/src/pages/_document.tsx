import { Html, Head, Main, NextScript } from 'next/document'
import { app } from '../config'

import type { App } from 'bold-config'

const { defaultLocale } = app as App

export default function Document({ __NEXT_DATA__ }: { __NEXT_DATA__: { locale: string } }) {
  const currentLocale = __NEXT_DATA__.locale ?? defaultLocale
  return (
    <Html lang={currentLocale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
