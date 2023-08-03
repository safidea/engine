import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { RenderPage } from '@application/usecases/page/RenderPage'
import { App } from '@domain/entities/App'
import { Context } from '@domain/entities/page/Context'
import { Page } from '@domain/entities/page/Page'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'

export class PageController {
  private renderPage: RenderPage

  constructor(fetcher: IFetcherGateway, app: App) {
    const fetcherGateway = new FetcherGateway(fetcher)
    this.renderPage = new RenderPage(fetcherGateway, app)
  }

  async render(page: Page, params: { [key: string]: string }) {
    const context = new Context(params)
    return this.renderPage.execute(page, context)
  }
}
