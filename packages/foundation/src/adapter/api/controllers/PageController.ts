import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { RenderPage } from '@application/usecases/page/RenderPage'
import { Page } from '@domain/entities/page/Page'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export class PageController {
  private renderPage: RenderPage

  constructor(ui: IUIGateway, fetcher: IFetcherGateway) {
    const pageGateway = new PageGateway(ui, fetcher)
    this.renderPage = new RenderPage(pageGateway)
  }

  async render(page: Page) {
    return this.renderPage.execute(page)
  }
}
