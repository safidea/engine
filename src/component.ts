import { Component } from '@domain/entities/component/Component'
import { drivers } from '@drivers/index'
import { ComponentError } from '@domain/entities/component/ComponentError'
import type { EngineError } from '@domain/entities/EngineError'
import { ComponentController } from './adapter/controllers/ComponentController'

export function createComponent(config: unknown): {
  component?: Component
  errors?: EngineError[]
} {
  const componentController = new ComponentController(drivers)
  const { entity, errors } = componentController.createEntity(config)
  return { component: entity, errors }
}

export type { IComponent } from '@domain/entities/component/IComponent'
export { ComponentError }
