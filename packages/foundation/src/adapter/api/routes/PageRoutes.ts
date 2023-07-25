import { IUIRepository } from '@domain/repositories/IUIRepository'
import { PageController } from '../controllers/PageController'
import { App } from '@domain/entities/App'
import { PageRoute } from '@domain/repositories/IServerRepository'

export class PageRoutes {
  private pageController: PageController

  constructor(app: App, ui: IUIRepository) {
    this.pageController = new PageController(app, ui)
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
