import { GetPage } from '@application/usecases/GetPage'
import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { App } from '@domain/entities/App'

export class PageController {
  private getPage: GetPage

  constructor(app: App, ui: IUIRepository) {
    const pageRepository = new PageRepository(ui)
    this.getPage = new GetPage(pageRepository, app)
  }

  async get(path: string) {
    return this.getPage.execute(path)
  }
}
