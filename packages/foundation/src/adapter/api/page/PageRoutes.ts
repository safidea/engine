import { PageController } from './PageController'
import { App } from '@domain/entities/app/App'
import { PageRequest, PageRoute } from '@adapter/spi/server/Server'
import { PageMiddleware } from './PageMiddleware'
import { Fetcher } from '@adapter/spi/fetcher/Fetcher'

export class PageRoutes {
  private pageController: PageController
  private pageMiddleware: PageMiddleware

  constructor(
    private app: App,
    fetcher: Fetcher
  ) {
    this.pageController = new PageController(fetcher, app)
    this.pageMiddleware = new PageMiddleware(app)
  }

  get routes(): PageRoute[] {
    return this.app.pages.map((page) => ({
      path: page.path,
      method: 'GET',
      title: page.title ?? 'My react app',
      handler: async (request: PageRequest) => this.render(request),
    }))
  }

  async render({ path, params }: PageRequest): Promise<() => JSX.Element> {
    const page = await this.pageMiddleware.pageExists(path)
    return this.pageController.render(page, params)
  }
}
