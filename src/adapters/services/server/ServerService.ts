import { App } from '@entities/app/App'
import { IServerDriver } from './IServerDriver'
import { PageRoutes } from '@adapters/routes/PageRoutes'
import { TableRoutes } from '@adapters/routes/TableRoutes'

export class ServerService {
  constructor(readonly driver: IServerDriver) {}

  async start(app: App): Promise<void> {
    if (app.pages.exist()) {
      const pageRoutes = new PageRoutes(app)
      for (const path of app.pages.getPaths()) {
        this.driver.get(path, pageRoutes.get)
      }
    }
    if (app.tables.exist()) {
      const tableRoutes = new TableRoutes(app)
      for (const path of app.tables.getPaths()) {
        this.driver.get(path, tableRoutes.get)
      }
    }
    await app.configure()
    return this.driver.start()
  }

  async stop(): Promise<void> {
    return this.driver.stop()
  }
}
