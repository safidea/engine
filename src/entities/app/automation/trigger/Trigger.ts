import { RecordCreatedTrigger } from './database/recordCreated/RecordCreatedTrigger'
import { RecordUpdatedTrigger } from './database/recordUpdated/RecordUpdatedTrigger'
import { TriggerParams } from './TriggerParams'
import { AutomationConfig } from '../Automation'
import { AutomationServices } from '../AutomationServices'

export type Trigger = RecordCreatedTrigger | RecordUpdatedTrigger

export function newTrigger(
  params: TriggerParams,
  services: AutomationServices,
  config: AutomationConfig
): Trigger {
  switch (params.event) {
    case 'record_created':
      return new RecordCreatedTrigger(params, services, config)
    case 'record_updated':
      return new RecordUpdatedTrigger(params, services, config)
  }
}
