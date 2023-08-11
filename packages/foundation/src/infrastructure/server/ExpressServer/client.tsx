import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/page/PageController'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'

import type { FoundationData } from '@infrastructure/server/ExpressServer/server'

declare global {
  interface Window {
    __FOUNDATION_DATA__: FoundationData
  }
}

;(async () => {
  const { app: appDto, path, params } = window.__FOUNDATION_DATA__
  const app = AppMapper.toEntity(appDto, selectUI(uiName))
  const page = app.getPageByPath(path)
  const pageController = new PageController(selectFetcher(fetcherName, url), app)
  const Page = await pageController.render(page, params)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
