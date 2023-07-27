import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'
import { PageRoute } from '@domain/repositories/IServerRepository'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { IFetcherRepository } from '@domain/repositories/IFetcherRepository'

export class PageRoutes {
  private pageController: PageController
  private pageMiddleware: PageMiddleware

  constructor(app: App, ui: IUIRepository, fetcher: IFetcherRepository) {
    this.pageController = new PageController(ui, fetcher)
    this.pageMiddleware = new PageMiddleware(app)
  }

  get routes(): PageRoute[] {
    return [
      {
        path: '*',
        method: 'GET',
        handler: async (path: string) => this.render(path),
      },
    ]
  }

  async render(path: string) {
    const page = await this.pageMiddleware.pathExists(path)
    return this.pageController.render(page)
  }
}
