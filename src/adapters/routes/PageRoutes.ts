import { PageController } from '../controllers/PageController'
import { App } from '@entities/app/App'
import { PageValidator } from '../validators/PageValidator'
import { ServerRequest } from '@adapters/services/server/IServerDriver'

export class PageRoutes {
  private pageController: PageController
  private pageValidator: PageValidator

  constructor(app: App) {
    this.pageController = new PageController(app)
    this.pageValidator = new PageValidator(app)
  }

  async get(request: ServerRequest) {
    const page = this.pageValidator.pageExists(request.path)
    const context = this.pageValidator.validateContext(request.params)
    const html = await this.pageController.renderHtml(page, context)
    return { html }
  }
}
