import { RecordCreatedTrigger } from './database/recordCreated/RecordCreatedTrigger'
import { RecordUpdatedTrigger } from './database/recordUpdated/RecordUpdatedTrigger'
import { TriggerParams } from './TriggerParams'
import { AppServices } from '../../App'
import { AutomationConfig } from '../Automation'

export type Trigger = RecordCreatedTrigger | RecordUpdatedTrigger

export function newTrigger(
  params: TriggerParams,
  services: AppServices,
  config: AutomationConfig
): Trigger {
  switch (params.event) {
    case 'record_created':
      return new RecordCreatedTrigger(params, services, config)
    case 'record_updated':
      return new RecordUpdatedTrigger(params, services, config)
  }
}
