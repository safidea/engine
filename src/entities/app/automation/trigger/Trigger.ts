import { ServerStartedTrigger } from './server/serverStarted/ServerStartedTrigger'
import { RecordCreatedTrigger } from './database/recordCreated/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './server/serverStopped/ServerStoppedTrigger'
import { RecordUpdatedTrigger } from './database/recordUpdated/RecordUpdatedTrigger'
import { TriggerParams } from './TriggerParams'
import { AppServices } from '../../App'
import { AutomationConfig } from '../Automation'

export type Trigger =
  | RecordCreatedTrigger
  | RecordUpdatedTrigger
  | ServerStartedTrigger
  | ServerStoppedTrigger

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
    case 'server_started':
      return new ServerStartedTrigger(params, services, config)
    case 'server_stopped':
      return new ServerStoppedTrigger(params, services, config)
  }
}
