import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import { AppController } from '@adapter/api/controllers/AppController'
import { PageRoutes } from '@adapter/api/routes/PageRoutes'
import { TableRoutes } from '@adapter/api/routes/TableRoutes'
import { orm } from '@infrastructure/orm'
import { schema } from '@infrastructure/config/Schema'
import { components } from '@infrastructure/components'
import { Server } from '@infrastructure/server'
import { Request } from '@domain/entities/Request'

const server = new Server()
const appController = new AppController({
  orm,
  schema,
  components,
})
const { pages, tables } = appController.get()

if (tables && tables.length > 0) {
  const tableRoutes = new TableRoutes(appController)
  server.configureRoutes([
    {
      path: '/api/table/:table:/id',
      method: 'GET',
      handler: async (request: Request) => tableRoutes.get(request),
    },
    {
      path: '/api/table/:table',
      method: 'GET',
      handler: async (request: Request) => tableRoutes.get(request),
    },
    {
      path: '/api/table/:table',
      method: 'POST',
      handler: async (request: Request) => tableRoutes.post(request),
    },
  ])
}

if (pages && pages.length > 0) {
  const pageRoutes = new PageRoutes(appController)
  server.configurePages([
    {
      path: '*',
      method: 'GET',
      handler: async (path: string) => pageRoutes.get(path),
    },
  ])
}

server.start()
