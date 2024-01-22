import { drivers } from '@drivers/index'
import type { EngineError } from '@domain/entities/EngineError'
import { App } from '@domain/entities/app/App'
import { AppController } from './adapter/controllers/AppController'

export function createApp(config: unknown): { app?: App; errors?: EngineError[] } {
  const appController = new AppController(drivers)
  const { entity, errors } = appController.createEntity(config)
  return { app: entity, errors }
}

export type { IApp } from '@domain/entities/app/IApp'
export { AppError } from '@domain/entities/app/AppError'
