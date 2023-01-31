import { Html, Head, Main, NextScript } from 'next/document'
import app from '../core/.config/app.json'
import type { AppInterface } from '../core/build/build.interfaces'

const { defaultLocale } = app as AppInterface

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
