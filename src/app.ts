import { AppEntity } from '@domain/entities/app/AppEntity'
import { drivers } from '@drivers/index'
import type { AppError } from '@domain/entities/app/AppError'

export class App {
  errors: AppError[] = []
  entity: AppEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateAppConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new AppEntity(json)
    }
  }
}

export type { IApp } from '@domain/entities/app/IApp'
export { AppError } from '@domain/entities/app/AppError'
