import { SpecApi } from '@adapter/api/SpecApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Spec as Config } from '@adapter/api/configs/spec/Spec'

export default class extends SpecApi {
  constructor() {
    super({
      drivers,
      components,
    })
  }
}
