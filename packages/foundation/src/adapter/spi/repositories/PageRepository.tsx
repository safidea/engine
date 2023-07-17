import { AppController } from '@adapter/api/controllers/AppController'
import { HtmlProps } from '@domain/components/IHtmlProps'
import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'

export class PageRepository {
  private components: IComponentsRepository

  constructor(appController: AppController) {
    this.components = appController.components
  }

  getComponent(name: string): React.FC<HtmlProps> {
    return this.components.get(name)
  }
}
