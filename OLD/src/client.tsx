/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { getFetcherDriver } from '@drivers/fetcher'
import { IServerData } from '@adapters/controllers/server/IServerData'
import { ClientMiddleware } from '@adapters/middlewares/client/ClientMiddleware'
import { getUIDriver } from '@drivers/ui'
import { getIconDriver } from '@drivers/icon'

declare global {
  interface Window {
    __ENGINE_DATA__: IServerData
  }
}

// TODO: use a router to manage client side navigation
const { config, params, drivers, path } = window.__ENGINE_DATA__
const icon = getIconDriver(drivers.icon)
const ui = getUIDriver(drivers.ui, icon)
const fetcher = getFetcherDriver(drivers.fetcher, { domain: window.location.origin })
const clientMiddleware = new ClientMiddleware({ ui, fetcher, icon }, params)
clientMiddleware.hydrate(config, path)
