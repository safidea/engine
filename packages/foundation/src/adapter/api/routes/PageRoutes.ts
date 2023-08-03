import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'
import { PageRequest, PageRoute } from '@domain/gateways/IServerGateway'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'
import { mapPageToDto } from '@application/mappers/page/PageMapper'
import { mapTableToDto } from '@application/mappers/table/TableMapper'

export class PageRoutes {
  private pageController: PageController
  private pageMiddleware: PageMiddleware

  constructor(
    private app: App,
    fetcher: IFetcherGateway
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
      pageDto: mapPageToDto(page),
      tablesDto: this.app.tables.map((table) => mapTableToDto(table)),
    }))
  }

  async render({ path, params }: PageRequest): Promise<() => JSX.Element> {
    const page = await this.pageMiddleware.pathExists(path)
    return this.pageController.render(page, params)
  }
}
