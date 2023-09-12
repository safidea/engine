import { RenderPage } from '@usecases/page/RenderPage'
import { App } from '@entities/app/App'
import { Context } from '@entities/app/page/Context'
import { Page } from '@entities/app/page/Page'
import { FetcherSpi } from '@adapters/spi/fetcher/FetcherSpi'

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
