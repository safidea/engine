import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { RenderPage } from '@application/usecases/RenderPage'
import { Page } from '@domain/entities/Page'
import { IFetcherRepository } from '@domain/repositories/IFetcherRepository'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export class PageController {
  private renderPage: RenderPage

  constructor(ui: IUIRepository, fetcher: IFetcherRepository) {
    const pageRepository = new PageRepository(ui, fetcher)
    this.renderPage = new RenderPage(pageRepository)
  }

  async render(page: Page) {
    return this.renderPage.execute(page)
  }
}
