import { FeatureApi } from '@adapter/api/FeatureApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Feature as Config } from '@adapter/api/configs/Feature'

export default class extends FeatureApi {
  constructor() {
    super({
      drivers,
      components,
    })
  }
}
