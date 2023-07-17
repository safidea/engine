import { AppController } from '../controllers/AppController'
import { PageController } from '../controllers/PageController'

export class PageRoutes {
  private pageController: PageController

  constructor(appController: AppController) {
    this.pageController = new PageController(appController)
  }

  async get(path: string) {
    return this.pageController.get(path)
  }
}
