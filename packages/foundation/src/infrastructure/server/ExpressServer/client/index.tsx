import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/page/PageController'
import { AppMapper } from '@adapter/api/app/AppMapper'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'

import type { FoundationData } from '@infrastructure/server/ExpressServer/server'

declare global {
  interface Window {
    __FOUNDATION_DATA__: FoundationData
  }
}

;(async () => {
  const { app: appDto, path, params } = window.__FOUNDATION_DATA__
  const app = AppMapper.toEntity(appDto, { ui: UnstyledUI, log: console.log, storage: {} as any })
  const page = app.getPageByPath(path)
  const fetcherAdapter = new NativeFetcher(window.location.origin)
  const fetcherSpi = new FetcherSpi(fetcherAdapter, app)
  const pageController = new PageController(app, fetcherSpi)
  const Page = await pageController.render(page, params)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
