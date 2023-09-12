import { ServerStartedTrigger } from './triggers/ServerStartedTrigger'
import { RecordCreatedTrigger } from './triggers/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './triggers/ServerStoppedTrigger'
import { RecordUpdatedTrigger } from './triggers/RecordUpdatedTrigger'
import { TriggerOptions } from './TriggerOptions'
import { AppDrivers } from '../App'
import { AutomationConfig } from './Automation'
import { TriggerError } from './TriggerError'

export type Trigger =
  | RecordCreatedTrigger
  | RecordUpdatedTrigger
  | ServerStartedTrigger
  | ServerStoppedTrigger

export function newTrigger(
  triggerOptions: TriggerOptions,
  drivers: AppDrivers,
  config: AutomationConfig
): Trigger {
  const { event } = triggerOptions
  if (event === 'record_created') {
    return new RecordCreatedTrigger(triggerOptions, drivers, config)
  }
  if (event === 'record_updated') {
    return new RecordUpdatedTrigger(triggerOptions, drivers, config)
  }
  if (event === 'server_started') {
    return new ServerStartedTrigger(triggerOptions, drivers, config)
  }
  if (event === 'server_stopped') {
    return new ServerStoppedTrigger(triggerOptions, drivers, config)
  }
  throw new TriggerError(event, 'Invalid trigger event')
}
