import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'

export class PageRoutes {
  private pageController: PageController

  constructor(app: App, components: IComponentsRepository) {
    this.pageController = new PageController(app, components)
  }

  get routes() {
    return [
      {
        path: '*',
        method: 'GET',
        handler: async (path: string) => this.get(path),
      },
    ]
  }

  async get(path: string) {
    return this.pageController.get(path)
  }
}
