import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapters/controllers/page/PageController'
import { ServerData } from '@adapters/services/server/ServerData'
import { AppMapper } from '@adapters/mappers/AppMapper'
import { UIService } from '@adapters/services/ui/UIService'
import { getUIDriver } from '@drivers/ui'
import { FetcherService } from '@adapters/services/fetcher/FetcherService'
import { getFetcherDriver } from '@drivers/fetcher'
import { Context } from '@entities/app/page/context/Context'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'

declare global {
  interface Window {
    __ENGINE_DATA__: ServerData
  }
}

// TODO: use a router to manage client side navigation
;(async () => {
  const { page: pageParams, tables, params, uiDriver } = window.__ENGINE_DATA__
  const uiService = new UIService(getUIDriver(uiDriver))
  const fetcherService = new FetcherService(
    getFetcherDriver('native', { domain: window.location.origin })
  )
  // TODO: find a better way to manage tables on the clients side without database service available
  const app = AppMapper.toApp(
    { pages: [pageParams], tables },
    { ui: uiService, fetcher: fetcherService, database: {} as IDatabaseService }
  )
  const page = app.pages.getByPath(pageParams.path)
  if (!page) throw new Error('Page not found: ' + pageParams.path)
  const pageController = new PageController(app)
  const Page = await pageController.renderHtml(page, new Context({ path: { params } }))
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
