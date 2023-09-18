import { PageController } from '../controllers/PageController'
import { App } from '@entities/app/App'
import { ServerRequest } from '@adapters/services/server/ServerRequest'
import { Page } from '@entities/app/page/Page'
import { ContextMapper } from '@adapters/mappers/ContextMapper'

export class PageMiddleware {
  private pageController: PageController

  constructor(app: App) {
    this.pageController = new PageController(app)
  }

  get(page: Page) {
    return async (request: ServerRequest) => {
      const context = ContextMapper.toContext({ path: { params: request.params ?? {} } })
      const html = await this.pageController.renderHtml(page, context)
      return { html }
    }
  }
}
