import { PageController } from './PageController'
import { App } from '@entities/app/App'
import { PageRequest, PageRoute } from '@adapters/spi/server/IServerAdapter'
import { PageMiddleware } from './PageMiddleware'
import { FetcherSpi } from '@adapters/spi/fetcher/FetcherSpi'

export class PageRoutes {
  private pageController: PageController
  private pageMiddleware: PageMiddleware

  constructor(
    private app: App,
    fetcherSpi: FetcherSpi
  ) {
    this.pageController = new PageController(app, fetcherSpi)
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
