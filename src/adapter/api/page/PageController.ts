import { RenderPage } from '@application/usecases/page/RenderPage'
import { App } from '@domain/entities/app/App'
import { Context } from '@domain/entities/page/Context'
import { Page } from '@domain/entities/page/Page'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'

export class PageController {
  private renderPage: RenderPage

  constructor(app: App, fetcherSpi: FetcherSpi) {
    this.renderPage = new RenderPage(fetcherSpi, app)
  }

  async render(page: Page, params: { [key: string]: string }) {
    const context = new Context(params)
    return this.renderPage.execute(page, context)
  }
}
