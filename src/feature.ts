import { FeatureApi } from '@adapter/api/FeatureApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Feature } from '@adapter/api/configs/Feature'

export default class extends FeatureApi {
  constructor() {
    super({
      drivers,
      components,
    })
  }
}
