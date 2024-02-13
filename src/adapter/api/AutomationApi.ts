import { AutomationMapper, type Params } from './mappers/automation/AutomationMapper'
import type { Automation } from '@domain/engine/automation/Automation'
import type { Params as SpisParams } from '@adapter/spi'
import { Base } from './base'
import type { Automation as Config } from './configs/automation/Automation'

export class AutomationApi extends Base<Config, Automation, Params> {
  constructor(params: SpisParams) {
    super(params, AutomationMapper, 'automation')
  }
}
