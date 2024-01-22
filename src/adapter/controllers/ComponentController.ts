import type { Drivers } from '@domain/drivers'
import { ComponentMiddleware } from '../middlewares/ComponentMiddleware'
import { Component } from '@domain/entities/component/Component'
import type { IController } from './IController'

export class ComponentController implements IController<Component> {
  private middleware: ComponentMiddleware

  constructor(drivers: Drivers) {
    this.middleware = new ComponentMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json || schemaErrors) return { errors: schemaErrors }
    const entity = new Component(json)
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
