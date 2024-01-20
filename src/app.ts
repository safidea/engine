import { AppEntity } from '@domain/entities/app/AppEntity'
import { drivers } from '@drivers/index'
import type { ConfigError } from '@domain/entities/ConfigError'

export class App {
  errors: ConfigError[] = []
  entity: AppEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateAppConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new AppEntity(json)
      if (this.entity.errors.length) {
        this.errors = this.entity.errors
      }
    }
  }
}

export type { IApp } from '@domain/entities/app/IApp'
export { AppError } from '@domain/entities/app/AppError'
