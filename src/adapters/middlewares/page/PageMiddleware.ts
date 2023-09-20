import { PageController } from '../../controllers/page/PageController'
import { App } from '@entities/app/App'
import { Page } from '@entities/app/page/Page'
import { ContextMapper } from '@adapters/mappers/ContextMapper'
import { IServerRequest } from '@adapters/controllers/server/IServerRequest'

export class PageMiddleware {
  private pageController: PageController

  constructor(app: App) {
    this.pageController = new PageController(app)
  }

  get(page: Page) {
    return async (request: IServerRequest) => {
      const context = ContextMapper.toContext({ path: { params: request.params ?? {} } })
      const html = await this.pageController.renderHtml(page, context)
      return { html }
    }
  }
}
