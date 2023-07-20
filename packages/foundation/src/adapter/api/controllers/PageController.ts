import { GetPage } from '@application/usecases/GetPage'
import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { App } from '@domain/entities/App'

export class PageController {
  private getPage: GetPage

  constructor(app: App, components: IComponentsRepository) {
    const pageRepository = new PageRepository(components)
    this.getPage = new GetPage(pageRepository, app)
  }

  async get(path: string) {
    return this.getPage.execute(path)
  }
}
