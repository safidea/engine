import { App } from '@entities/app/App'
import { IServerDriver } from './IServerDriver'
import { PageMiddleware } from '@adapters/middlewares/PageMiddleware'
import { TableMiddleware } from '@adapters/middlewares/TableMiddleware'

export class ServerService {
  constructor(readonly driver: IServerDriver) {}

  async start(app: App): Promise<void> {
    if (app.pages.exist()) {
      const pageMiddleware = new PageMiddleware(app)
      for (const path of app.pages.getPaths()) {
        this.driver.get(path, pageMiddleware.get())
      }
    }
    if (app.tables.exist()) {
      const tableMiddleware = new TableMiddleware(app)
      for (const table of app.tables.getAll()) {
        this.driver.post(`/api/sync/table`, tableMiddleware.sync())
        this.driver.get(`/api/table/${table.name}/:id`, tableMiddleware.getById(table))
        this.driver.patch(`/api/table/${table.name}/:id`, tableMiddleware.patchById(table))
        this.driver.delete(`/api/table/${table.name}/:id`, tableMiddleware.deleteById(table))
        this.driver.get(`/api/table/${table.name}`, tableMiddleware.get(table))
        this.driver.post(`/api/table/${table.name}`, tableMiddleware.post(table))
      }
    }
    await app.configure()
    return this.driver.start()
  }

  async stop(): Promise<void> {
    return this.driver.stop()
  }
}
