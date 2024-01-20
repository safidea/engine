import { ComponentEntity } from '@domain/entities/component/ComponentEntity'
import { drivers } from '@drivers/index'
import { ComponentError } from '@domain/entities/component/ComponentError'

export class Component {
  errors: ComponentError[] = []
  entity: ComponentEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateComponentConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new ComponentEntity(json)
    }
  }
}

export type { IComponent } from '@domain/entities/component/IComponent'
export { ComponentError }
