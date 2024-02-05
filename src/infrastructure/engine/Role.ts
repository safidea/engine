import { RoleApi } from '@adapter/api/RoleApi'
import type { EngineError } from '@domain/entities/EngineError'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { RoleError } from '@domain/entities/role/RoleError'
export type { Role as Config } from '@adapter/api/configs/Role'

export default class {
  private api: RoleApi

  constructor(private config: unknown) {
    this.api = new RoleApi({ drivers, components })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)
}
