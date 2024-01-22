import { Component } from '@domain/entities/component/Component'
import { drivers } from '@drivers/index'
import { ComponentError } from '@domain/entities/component/ComponentError'

export function createComponent(
  config: unknown
):
  | { errors: ComponentError[]; component: undefined }
  | { component: Component; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validateComponentConfig(config)
  if (errors) {
    return { errors, component: undefined }
  } else {
    const component = new Component(json)
    const errors = component.validateConfig()
    if (errors.length) {
      return { errors, component: undefined }
    }
    return { component, errors: undefined }
  }
}

export type { IComponent } from '@domain/entities/component/IComponent'
export { ComponentError }
