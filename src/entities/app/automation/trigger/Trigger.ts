import { ServerStartedTrigger } from './server/serverStarted/ServerStartedTrigger'
import { RecordCreatedTrigger } from './database/recordCreated/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './server/serverStopped/ServerStoppedTrigger'
import { RecordUpdatedTrigger } from './database/recordUpdated/RecordUpdatedTrigger'
import { TriggerOptions } from './TriggerOptions'
import { AppDrivers } from '../../App'
import { AutomationConfig } from '../Automation'

export type Trigger =
  | RecordCreatedTrigger
  | RecordUpdatedTrigger
  | ServerStartedTrigger
  | ServerStoppedTrigger

export function newTrigger(
  options: TriggerOptions,
  drivers: AppDrivers,
  config: AutomationConfig
): Trigger {
  switch (options.event) {
    case 'record_created':
      return new RecordCreatedTrigger(options, drivers, config)
    case 'record_updated':
      return new RecordUpdatedTrigger(options, drivers, config)
    case 'server_started':
      return new ServerStartedTrigger(options, drivers, config)
    case 'server_stopped':
      return new ServerStoppedTrigger(options, drivers, config)
  }
}
