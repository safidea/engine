import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import { theme } from '../config'
import fonts from '../config/fonts'

import type { AppProps, NextWebVitalsMetric } from 'next/app'
import type { Theme } from 'foundation-config'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}

function App({ Component, pageProps }: AppProps) {
  const container = (theme as Theme).container ? 'container' : ''
  const fontsJoined = fonts ? fonts.join(' ') : ''
  return (
    <main className={[container, fontsJoined, 'font-primary'].join(' ')}>
      <Component {...pageProps} />
    </main>
  )
}

// Fix Typescript build error
const TranslatedApp = appWithTranslation(App) as unknown as AppProps

export default TranslatedApp
