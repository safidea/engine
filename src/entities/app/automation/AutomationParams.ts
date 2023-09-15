import * as t from 'io-ts'
import { ActionParams } from './action/ActionParams'
import { TriggerParams } from './trigger/TriggerParams'

export const AutomationParams = t.type({
  name: t.string,
  trigger: TriggerParams,
  actions: t.array(ActionParams),
})

export type AutomationParams = t.TypeOf<typeof AutomationParams>
