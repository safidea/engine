import { AutomationApi } from '@adapter/api/AutomationApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Automation as Config } from '@adapter/api/configs/automation/Automation'

export default class extends AutomationApi {
  constructor() {
    super({
      drivers,
      components,
    })
  }
}
