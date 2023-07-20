import { HtmlProps } from '@domain/components/IHtmlProps'
import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'

export class PageRepository {
  constructor(private readonly _components: IComponentsRepository) {}

  getComponent(name: string): React.FC<HtmlProps> {
    return this._components.get(name)
  }
}
