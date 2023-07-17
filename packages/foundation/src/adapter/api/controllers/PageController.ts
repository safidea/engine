import { GetPage } from '@application/usecases/GetPage'
import { AppController } from './AppController'
import { PageRepository } from '@adapter/spi/repositories/PageRepository'

export class PageController {
  private getPage: GetPage

  constructor(appController: AppController) {
    const pageRepository = new PageRepository()
    this.getPage = new GetPage(pageRepository, appController)
  }

  async get(path: string) {
    return this.getPage.execute(path)
  }
}
