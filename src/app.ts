import { AppEntity } from '@domain/entities/app/AppEntity'
import type { AppError } from '@domain/entities/app/AppError'
import { drivers } from '@drivers/index'

export type { IApp } from '@domain/entities/app/IApp'

export class App {
  errors: AppError[] = []
  entity: AppEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { data, errors } = jsonValidator.validateAppConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new AppEntity(data)
    }
  }
}
