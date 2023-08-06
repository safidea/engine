import { RenderPage } from '@application/usecases/page/RenderPage'
import { App } from '@domain/entities/app/App'
import { Context } from '@domain/entities/page/Context'
import { Page } from '@domain/entities/page/Page'
import { Fetcher } from '@adapter/spi/fetcher/Fetcher'
import { FetcherGateway } from '@adapter/spi/fetcher/FetcherGateway'

export class PageController {
  private renderPage: RenderPage

  constructor(fetcher: Fetcher, app: App) {
    const fetcherGateway = new FetcherGateway(fetcher, app)
    this.renderPage = new RenderPage(fetcherGateway)
  }

  async render(page: Page, params: { [key: string]: string }) {
    const context = new Context(params)
    return this.renderPage.execute(page, context)
  }
}
