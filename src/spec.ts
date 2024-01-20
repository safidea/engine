import { SpecEntity } from '@domain/entities/spec/SpecEntity'
import { drivers } from '@drivers/index'
import { SpecError } from '@domain/entities/spec/SpecError'

export class Spec {
  errors: SpecError[] = []
  entity: SpecEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateSpecConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new SpecEntity(json)
    }
  }
}

export type { ISpec } from '@domain/entities/spec/ISpec'
export { SpecError }
