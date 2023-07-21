import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'
import { PageRoute } from '@domain/repositories/IServerRepository'

export class PageRoutes {
  private pageController: PageController

  constructor(app: App, components: IComponentsRepository) {
    this.pageController = new PageController(app, components)
  }

  get routes(): PageRoute[] {
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
