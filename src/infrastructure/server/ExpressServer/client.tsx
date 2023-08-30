import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/page/PageController'
import { AppMapper } from '@adapter/api/app/AppMapper'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import * as UI from '@infrastructure/ui'

import type { FoundationData } from '@infrastructure/server/ExpressServer/server'

declare global {
  interface Window {
    __FOUNDATION_DATA__: FoundationData
    appRoot: any
  }
}

function getUI(uiName: string) {
  switch (uiName) {
    case 'TailwindUI':
      return UI.TailwindUI
    default:
      return UI.UnstyledUI
  }
}

if (module.hot) {
  module.hot.accept()
}

;(async () => {
  const { page: pageDto, tables, params, adapters } = window.__FOUNDATION_DATA__
  const app = AppMapper.toEntity({ pages: [pageDto], tables }, { ui: getUI(adapters.uiName) })
  const page = app.getPageByPath(pageDto.path)
  const fetcherAdapter = new NativeFetcher(window.location.origin)
  const fetcherSpi = new FetcherSpi(fetcherAdapter, app)
  const pageController = new PageController(app, fetcherSpi)
  const Page = await pageController.render(page, params)
  if (!window.appRoot) {
    const container = document.getElementById('root')
    if (!container) throw new Error('Root element not found')
    window.appRoot = hydrateRoot(container, <Page />)
  } else {
    console.log(window.appRoot)
    window.appRoot.render(<Page />)
  }
})()
