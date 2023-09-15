import { ServerStartedTrigger } from './server/serverStarted/ServerStartedTrigger'
import { RecordCreatedTrigger } from './database/recordCreated/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './server/serverStopped/ServerStoppedTrigger'
import { RecordUpdatedTrigger } from './database/recordUpdated/RecordUpdatedTrigger'
import { TriggerParams } from './TriggerParams'
import { AppDrivers } from '../../App'
import { AutomationConfig } from '../Automation'

export type Trigger =
  | RecordCreatedTrigger
  | RecordUpdatedTrigger
  | ServerStartedTrigger
  | ServerStoppedTrigger

export function newTrigger(
  params: TriggerParams,
  drivers: AppDrivers,
  config: AutomationConfig
): Trigger {
  switch (params.event) {
    case 'record_created':
      return new RecordCreatedTrigger(params, drivers, config)
    case 'record_updated':
      return new RecordUpdatedTrigger(params, drivers, config)
    case 'server_started':
      return new ServerStartedTrigger(params, drivers, config)
    case 'server_stopped':
      return new ServerStoppedTrigger(params, drivers, config)
  }
}
