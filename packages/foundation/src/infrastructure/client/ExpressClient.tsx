import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/controllers/PageController'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { mapDtoToApp } from '@application/mappers/AppMapper'

import type { FoundationData } from '@infrastructure/server/ExpressServer'

function selectUI(uiName: string) {
  switch (uiName) {
    case 'unstyled':
      return UnstyledUI
    default:
      throw new Error('UI not found')
  }
}

function selectFetcher(fetcherName: string, domain: string) {
  switch (fetcherName) {
    case 'native':
      return NativeFetcher(domain)
    default:
      throw new Error('UI not found')
  }
}

declare global {
  interface Window {
    __FOUNDATION_DATA__: FoundationData
  }
}

;(async () => {
  const { uiName, fetcherName, domain, appDto, pagePath, params } = window.__FOUNDATION_DATA__
  const app = mapDtoToApp(appDto, selectUI(uiName))
  const { pages } = app
  const page = pages.find((page) => page.path === pagePath)
  if (!page) throw new Error(`Page ${pagePath} not found`)
  const pageController = new PageController(selectFetcher(fetcherName, domain), app)
  const Page = await pageController.render(page, params)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
