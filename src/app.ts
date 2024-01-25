import { drivers } from '@drivers/index'
import type { EngineError } from '@domain/entities/EngineError'
import { App } from '@domain/entities/app/App'
import { AppController } from './adapter/controllers/AppController'
import type { Components } from '@domain/components'

export function createApp(
  config: unknown,
  params?: {
    components?: Partial<Components>
  }
): { app?: App; errors: EngineError[] } {
  const appController = new AppController(drivers, params)
  const { entity, errors } = appController.createEntity(config)
  return { app: entity, errors }
}

export type { IApp } from '@domain/entities/app/IApp'
export type { Components } from '@domain/components'
export { AppError } from '@domain/entities/app/AppError'
