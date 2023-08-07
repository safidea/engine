import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/page/PageController'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'

import type { FoundationData } from '@infrastructure/server/ExpressServer'

function selectUI(uiName: string) {
  switch (uiName) {
    case 'unstyled':
      return UnstyledUI
    default:
      throw new Error('UI not found')
  }
}

function selectFetcher(fetcherName: string, url: string) {
  switch (fetcherName) {
    case 'native':
      return new NativeFetcher(url)
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
  const { uiName, fetcherName, url, appDto, pagePath, params } = window.__FOUNDATION_DATA__
  const app = AppMapper.toEntity(appDto, selectUI(uiName))
  const page = app.getPageByPath(pagePath)
  const pageController = new PageController(selectFetcher(fetcherName, url), app)
  const Page = await pageController.render(page, params)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
