import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapters/controllers/page/PageController'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { getUIDriver } from '@drivers/ui'
import { getFetcherDriver } from '@drivers/fetcher'
import { Context } from '@entities/app/page/context/Context'
import { IServerData } from '@adapters/controllers/server/IServerData'

declare global {
  interface Window {
    __ENGINE_DATA__: IServerData
  }
}

// TODO: use a router to manage client side navigation
;(async () => {
  const { page: pageParams, tables, params, uiDriver } = window.__ENGINE_DATA__
  // TODO: find a better way to manage tables on the clients side without database service available
  const app = AppMapper.toClientApp(
    { pages: [pageParams], tables },
    {
      ui: getUIDriver(uiDriver),
      fetcher: getFetcherDriver('native', { domain: window.location.origin }),
    }
  )
  const page = app.pages.getByPath(pageParams.path)
  if (!page) throw new Error('Page not found: ' + pageParams.path)
  const pageController = new PageController(app)
  const Page = await pageController.renderHtml(page, new Context({ path: { params } }))
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
