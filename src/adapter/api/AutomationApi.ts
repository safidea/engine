import { AutomationMapper, type Params } from './mappers/automation/AutomationMapper'
import type { Automation } from '@domain/entities/automation/Automation'
import { AutomationError } from '@domain/entities/automation/AutomationError'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { Automation as AutomationConfig } from './configs/automation/Automation'

export class AutomationApi extends Api<AutomationConfig, AutomationError, Automation, Params> {
  constructor(params: SpisParams) {
    super(params, AutomationMapper, 'automation')
  }
}
