import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { getUIDriver } from '@drivers/ui'
import { getFetcherDriver } from '@drivers/fetcher'
import { IServerData } from '@adapters/controllers/server/IServerData'
import { IDatabaseDriver } from '@adapters/mappers/database/IDatabaseDriver'
import { ContextMapper } from '@adapters/mappers/ContextMapper'

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
      database: {} as IDatabaseDriver,
    }
  )
  const page = app.pages.getByPath(pageParams.path)
  if (!page) throw new Error('Page not found: ' + pageParams.path)
  const Page = await page.render(ContextMapper.toContext({ path: { params } }))
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
