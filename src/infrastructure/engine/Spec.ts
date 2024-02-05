import { SpecApi } from '@adapter/api/SpecApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { SpecError } from '@domain/entities/spec/SpecError'
export type { Spec } from '@adapter/api/configs/spec/Spec'

class Spec {
  constructor(private api: SpecApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new Spec(new SpecApi(drivers, components))
