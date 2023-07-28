import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'
import { PageRoute } from '@domain/gateways/IServerGateway'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'
import { mapPageToDto } from '@application/mappers/table/PageMapper'

export class PageRoutes {
  private pageController: PageController
  private pageMiddleware: PageMiddleware

  constructor(
    private app: App,
    fetcher: IFetcherGateway
  ) {
    this.pageController = new PageController(fetcher)
    this.pageMiddleware = new PageMiddleware(app)
  }

  get routes(): PageRoute[] {
    return this.app.pages.map((page) => ({
      path: page.path,
      method: 'GET',
      title: page.title ?? 'My react app',
      handler: async (path: string) => this.render(path),
      config: mapPageToDto(page) 
    }))
  }

  async render(path: string) {
    const page = await this.pageMiddleware.pathExists(path)
    return this.pageController.render(page)
  }
}
