import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps, NextWebVitalsMetric } from 'next/app'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}

function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  )
}

export default appWithTranslation(App)
