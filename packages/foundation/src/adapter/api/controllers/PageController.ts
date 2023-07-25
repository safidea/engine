import { RenderPage } from '@application/usecases/RenderPage'
import { Page } from '@domain/entities/Page'

export class PageController {
  private renderPage: RenderPage

  constructor() {
    this.renderPage = new RenderPage()
  }

  async render(page: Page) {
    return this.renderPage.execute(page)
  }
}
