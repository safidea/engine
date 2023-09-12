import React from 'react'
import { Root, hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapters/controllers/PageController'
import { AppMapper } from '@adapters/api/app/AppMapper'
import { FetcherSpi } from '@adapters/spi/fetcher/FetcherSpi'
import { NativeFetcher } from '@drivers/fetcher/NativeFetcher'
import * as UI from '@drivers/ui'

import type { EngineData } from '@drivers/server/ExpressServer'

declare global {
  interface Window {
    __FOUNDATION_DATA__: EngineData
    rootPage: Root
  }
  interface NodeModule {
    hot: {
      accept: () => void
    }
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

;(async () => {
  const { page: pageDto, tables, params, uiName, development } = window.__FOUNDATION_DATA__
  const app = AppMapper.toEntity({ pages: [pageDto], tables }, { ui: getUI(uiName) })
  const page = app.getPageByPath(pageDto.path)
  const fetcherAdapter = new NativeFetcher(window.location.origin)
  const fetcherSpi = new FetcherSpi(fetcherAdapter, app)
  const pageController = new PageController(app, fetcherSpi)
  const Page = await pageController.render(page, params)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  if (!development) {
    hydrateRoot(container, <Page />)
  } else {
    if (module.hot) {
      module.hot.accept()
    }
    if (!window.rootPage) {
      window.rootPage = hydrateRoot(container, <Page />)
    } else {
      window.rootPage.render(<Page />)
    }
  }
})()
